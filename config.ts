// Make sure to replace the values with your actual API key and model

// USING ANTHROPIC CLAUDE SONNET 4 is strongly recommended for best results

export const config = {
  aiSdk: {
    // The AI provider to use: "openai", "anthropic", "gemini", or "openrouter"
    provider: "anthropic", // Change this to "gemini" to use Google Gemini

    // The base URL for the AI SDK, leave blank for official APIs
    baseUrl: "https://openrouter.ai/api/v1",

    // Your API key for the provider
    // For OpenAI: Get from https://platform.openai.com/api-keys
    // For Anthropic: Get from https://console.anthropic.com/
    // For Gemini: Get from https://aistudio.google.com/app/apikey
    // For OpenRouter: Get from https://openrouter.ai/keys
    apiKey: "sk-or-v1-824...",

    // The model to use based on your provider:
    // OpenAI: "gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"
    // Anthropic: "claude-3-5-sonnet-20241022", "claude-3-opus-20240229"
    // Gemini: "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"
    // OpenRouter: "anthropic/claude-sonnet-4", "openai/gpt-4", etc.
    model: "anthropic/claude-sonnet-4",

    // Temperature for response randomness (0.0 to 1.0)
    temperature: 0.7,
  },
} as const;