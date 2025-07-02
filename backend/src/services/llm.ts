import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config";
import prompt from "../utils/prompt.txt";
import * as dockerService from "./docker";
import * as fileService from "./file";

// Initialize AI clients based on provider
let openai: OpenAI | null = null;
let gemini: GoogleGenerativeAI | null = null;
let geminiModel: any = null;

function initializeAIClients() {
  const provider = config.aiSdk.provider || "openai";
  
  switch (provider) {
    case "openai":
    case "anthropic":
    case "openrouter":
      openai = new OpenAI({
        apiKey: config.aiSdk.apiKey,
        baseURL: config.aiSdk.baseUrl || "https://api.openai.com/v1",
      });
      break;
    
    case "gemini":
      if (!config.aiSdk.apiKey) {
        throw new Error("Gemini API key is required");
      }
      gemini = new GoogleGenerativeAI(config.aiSdk.apiKey);
      geminiModel = gemini.getGenerativeModel({ 
        model: config.aiSdk.model || "gemini-1.5-pro",
        generationConfig: {
          temperature: config.aiSdk.temperature || 0.7,
          maxOutputTokens: 8192,
        },
      });
      break;
    
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

// Initialize clients on module load
initializeAIClients();

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: "image" | "document";
  data: string;
  name: string;
  mimeType: string;
  size: number;
}

export interface ChatSession {
  id: string;
  containerId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const chatSessions = new Map<string, ChatSession>();

export async function createChatSession(
  containerId: string
): Promise<ChatSession> {
  const sessionId = `${containerId}-${Date.now()}`;
  const session: ChatSession = {
    id: sessionId,
    containerId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatSessions.set(sessionId, session);
  return session;
}

export function getChatSession(sessionId: string): ChatSession | undefined {
  return chatSessions.get(sessionId);
}

export function getOrCreateChatSession(containerId: string): ChatSession {
  const existingSession = Array.from(chatSessions.values()).find(
    (session) => session.containerId === containerId
  );

  if (existingSession) {
    return existingSession;
  }

  const sessionId = `${containerId}-${Date.now()}`;
  const session: ChatSession = {
    id: sessionId,
    containerId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatSessions.set(sessionId, session);
  return session;
}

function buildMessageContent(
  message: string,
  attachments: Attachment[] = []
): any[] {
  const content: any[] = [{ type: "text", text: message }];

  for (const attachment of attachments) {
    if (attachment.type === "image") {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${attachment.mimeType};base64,${attachment.data}`,
        },
      });
    } else if (attachment.type === "document") {
      const decodedText = Buffer.from(attachment.data, "base64").toString(
        "utf-8"
      );
      content.push({
        type: "text",
        text: `\n\nDocument "${attachment.name}" content:\n${decodedText}`,
      });
    }
  }

  return content;
}

function buildGeminiContent(
  message: string,
  attachments: Attachment[] = []
): any[] {
  const parts: any[] = [{ text: message }];

  for (const attachment of attachments) {
    if (attachment.type === "image") {
      parts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data,
        },
      });
    } else if (attachment.type === "document") {
      const decodedText = Buffer.from(attachment.data, "base64").toString(
        "utf-8"
      );
      parts.push({
        text: `\n\nDocument "${attachment.name}" content:\n${decodedText}`,
      });
    }
  }

  return parts;
}

export async function sendMessage(
  containerId: string,
  userMessage: string,
  attachments: Attachment[] = []
): Promise<{ userMessage: Message; assistantMessage: Message }> {
  const session = getOrCreateChatSession(containerId);

  const userMsg: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  session.messages.push(userMsg);

  const fileContentTree = await fileService.getFileContentTree(
    dockerService.docker,
    containerId
  );

  const codeContext = JSON.stringify(fileContentTree, null, 2);
  const systemPrompt = `${prompt}\n\nCurrent codebase structure and content:\n${codeContext}`;

  let assistantContent: string;
  const provider = config.aiSdk.provider || "openai";

  if (provider === "gemini") {
    // Use Gemini API
    if (!geminiModel) {
      throw new Error("Gemini model not initialized");
    }

    const chat = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm ready to help you with your Next.js project. What would you like me to do?" }],
        },
        ...session.messages.slice(0, -1).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: msg.role === "user" && msg.attachments
            ? buildGeminiContent(msg.content, msg.attachments)
            : [{ text: msg.content }],
        })),
      ],
    });

    const userContent = attachments.length > 0 
      ? buildGeminiContent(userMessage, attachments)
      : [{ text: userMessage }];

    const result = await chat.sendMessage(userContent);
    assistantContent = result.response.text() || "Sorry, I could not generate a response.";
  } else {
    // Use OpenAI-compatible API (OpenAI, Anthropic, OpenRouter)
    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...session.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content:
          msg.role === "user" && msg.attachments
            ? buildMessageContent(msg.content, msg.attachments)
            : msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: config.aiSdk.model,
      messages: openaiMessages,
      temperature: config.aiSdk.temperature,
    });

    assistantContent =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";
  }

  const assistantMsg: Message = {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: assistantContent,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(assistantMsg);
  session.updatedAt = new Date().toISOString();

  return {
    userMessage: userMsg,
    assistantMessage: assistantMsg,
  };
}

export async function* sendMessageStream(
  containerId: string,
  userMessage: string,
  attachments: Attachment[] = []
): AsyncGenerator<{ type: "user" | "assistant" | "done"; data: any }> {
  const session = getOrCreateChatSession(containerId);

  const userMsg: Message = {
    id: `user-${Date.now()}`,
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  session.messages.push(userMsg);
  yield { type: "user", data: userMsg };

  const fileContentTree = await fileService.getFileContentTree(
    dockerService.docker,
    containerId
  );

  const codeContext = JSON.stringify(fileContentTree, null, 2);
  const systemPrompt = `${prompt}\n\nCurrent codebase structure and content:\n${codeContext}`;

  const assistantId = `assistant-${Date.now()}`;
  let assistantContent = "";
  const provider = config.aiSdk.provider || "openai";

  if (provider === "gemini") {
    // Use Gemini API with streaming
    if (!geminiModel) {
      throw new Error("Gemini model not initialized");
    }

    const chat = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm ready to help you with your Next.js project. What would you like me to do?" }],
        },
        ...session.messages.slice(0, -1).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: msg.role === "user" && msg.attachments
            ? buildGeminiContent(msg.content, msg.attachments)
            : [{ text: msg.content }],
        })),
      ],
    });

    const userContent = attachments.length > 0 
      ? buildGeminiContent(userMessage, attachments)
      : [{ text: userMessage }];

    const result = await chat.sendMessageStream(userContent);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        assistantContent += chunkText;
        yield {
          type: "assistant",
          data: {
            id: assistantId,
            role: "assistant",
            content: assistantContent,
            timestamp: new Date().toISOString(),
          },
        };
      }
    }
  } else {
    // Use OpenAI-compatible API with streaming
    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...session.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content:
          msg.role === "user" && msg.attachments
            ? buildMessageContent(msg.content, msg.attachments)
            : msg.content,
      })),
    ];

    const stream = await openai.chat.completions.create({
      model: config.aiSdk.model,
      messages: openaiMessages,
      temperature: config.aiSdk.temperature,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        assistantContent += delta.content;
        yield {
          type: "assistant",
          data: {
            id: assistantId,
            role: "assistant",
            content: assistantContent,
            timestamp: new Date().toISOString(),
          },
        };
      }
    }
  }

  const finalAssistantMsg: Message = {
    id: assistantId,
    role: "assistant",
    content: assistantContent,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(finalAssistantMsg);
  session.updatedAt = new Date().toISOString();

  yield { type: "done", data: finalAssistantMsg };
}