<a name="readme-top"></a>

<div align="center">

<h3 align="center">Say hi to December ☃️</h3>

  <p align="center">
    December is an open-source alternative to AI-powered development platforms like Loveable, Replit, and Bolt that you can run locally with your own API keys, ensuring complete privacy and significant cost savings. 
    <br />
    <br />
    December lets you build full-stack applications from simple text prompts using AI.
    <br />
    <br />
    <a href="#get-started">Get started</a>
    ·
    <a href="https://github.com/ntegrals/december/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/ntegrals/december/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=">Request Feature</a>

  </p>
</div>
<a href="https://github.com/ntegrals/december">
    <img src=".assets/preview.png" alt="December Preview">
  </a>

## Features

    ✅ AI-powered project creation from natural language prompts
    ✅ Multiple AI providers: OpenAI, Anthropic Claude, Google Gemini, OpenRouter
    ✅ Containerized Next.js applications with Docker
    ✅ Live preview with mobile and desktop views
    ✅ Full-featured Monaco code editor with file management
    ✅ Real-time chat assistant for development help
    ✅ Project export and deployment capabilities

## Roadmap

    🔄 LLM streaming support
    🔄 Document & image attachments
    🔄 Improved fault tolerance
    🔄 Comprehensive test coverage
    🔄 Multi-framework support (beyond Next.js)

## Get started

1. Clone the repo

   ```sh
   git clone https://github.com/ntegrals/december
   ```

2. Get an API Key from any supported AI provider and set it in the `config.ts` file.

   **Supported AI Providers:**
   - **OpenAI** - Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Anthropic Claude** - Get API key from [Anthropic Console](https://console.anthropic.com/) (Recommended)
   - **Google Gemini** - Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **OpenRouter** - Get API key from [OpenRouter](https://openrouter.ai/keys) (Access to multiple models)

   The start.sh script will automatically copy over the file into the backend folder.

   **Example configurations:**

   **For Anthropic Claude (Recommended):**
   ```typescript
   export const config = {
     aiSdk: {
       provider: "anthropic",
       baseUrl: "", // Leave empty for official API
       apiKey: "sk-ant-api03-...", // Your Anthropic API key
       model: "claude-3-5-sonnet-20241022",
       temperature: 0.7,
     },
   } as const;
   ```

   **For Google Gemini:**
   ```typescript
   export const config = {
     aiSdk: {
       provider: "gemini",
       baseUrl: "", // Leave empty for official API
       apiKey: "AIza...", // Your Google AI API key
       model: "gemini-1.5-pro",
       temperature: 0.7,
     },
   } as const;
   ```

   **For OpenAI:**
   ```typescript
   export const config = {
     aiSdk: {
       provider: "openai",
       baseUrl: "", // Leave empty for official API
       apiKey: "sk-...", // Your OpenAI API key
       model: "gpt-4",
       temperature: 0.7,
     },
   } as const;
   ```

   **For OpenRouter (Multiple Models):**
   ```typescript
   export const config = {
     aiSdk: {
       provider: "openrouter",
       baseUrl: "https://openrouter.ai/api/v1",
       apiKey: "sk-or-v1-...", // Your OpenRouter API key
       model: "anthropic/claude-3-5-sonnet",
       temperature: 0.7,
     },
   } as const;
   ```

3. Install docker (Docker Desktop is the easiest way to get started)

   - [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - [Docker Engine for Linux](https://docs.docker.com/engine/install/)

   Make sure you have Docker running and the Docker CLI installed before proceeding.

4. Install dependencies

   **Option A: Using the start script (recommended)**
   ```sh
   sh start.sh
   ```

   **Option B: Manual setup**
   
   Install backend dependencies:
   ```sh
   cd backend
   npm install
   cd ..
   ```
   
   Install frontend dependencies:
   ```sh
   cd frontend
   npm install
   cd ..
   ```
   
   Copy config file and start servers:
   ```sh
   cp config.ts backend/config.ts
   
   # Start backend (in one terminal)
   cd backend && npm run dev
   
   # Start frontend (in another terminal)
   cd frontend && npm run dev
   ```

5. The application will start in development mode, and you can access it at [http://localhost:3000](http://localhost:3000).

   The backend will run on port 4000, and the frontend will run on port 3000.

   You can now start building your applications with December! 🥳

## Alternative Package Managers

December supports multiple package managers:

### Using Bun (fastest)
```sh
# Install Bun first: https://bun.sh/
cd backend && bun install
cd frontend && bun install

# Run with start script
sh start.sh
```

### Using npm (most compatible)
```sh
cd backend && npm install
cd frontend && npm install

# Run with start script
sh start.sh
```

### Using yarn
```sh
cd backend && yarn install
cd frontend && yarn install

# Update start.sh to use yarn instead of npm
```

### Using pnpm
```sh
cd backend && pnpm install
cd frontend && pnpm install

# Update start.sh to use pnpm instead of npm
```

## Running Individual Components

### Backend only
```sh
cd backend
npm install
cp ../config.ts ./config.ts
npm run dev
```

### Frontend only
```sh
cd frontend
npm install
npm run dev
```

## AI Provider Comparison

| Provider | Strengths | Best For | Cost |
|----------|-----------|----------|------|
| **Anthropic Claude** | Best coding capabilities, excellent reasoning | Complex development tasks | $$$ |
| **Google Gemini** | Fast, good multimodal support, cost-effective | General development, image analysis | $$ |
| **OpenAI GPT-4** | Well-rounded, extensive ecosystem | General purpose, established workflows | $$$ |
| **OpenRouter** | Access to multiple models, competitive pricing | Experimenting with different models | $ - $$$ |

**Recommendation:** Start with **Anthropic Claude 3.5 Sonnet** for the best coding experience, or **Google Gemini 1.5 Pro** for a cost-effective alternative.

<!-- ## Demo

You can test the December here: [https://december.ai](https://december.ai) -->

## Motivation

AI-powered development platforms have revolutionized how we build applications. They allow developers to go from idea to working application in seconds, but most solutions are closed-source or require expensive subscriptions.

Until recently, building a local alternative that matched the speed and capabilities of platforms like Loveable, Replit, or Bolt seemed challenging. The recent advances in AI and containerization technologies have made it possible to build a fast, local development environment that gives you full control over your code and API usage.

I would love for this repo to become the go-to place for people who want to run their own AI-powered development environment. I've been working on this project for a while now and I'm really excited to share it with you.

## Why run December locally?

Building applications shouldn't require expensive subscriptions or sacrificing your privacy. December gives you the power of platforms like Loveable, Replit, and Bolt without the downsides:

- **Full Control & Privacy** - Your code, ideas, and projects never leave your machine. No cloud storage, no data mining, no vendor lock-in
- **Your API Keys, Your Costs** - Use your own AI API key and pay only for what you use. No monthly subscriptions or usage limits imposed by third parties
- **Complete Feature Access** - No paywalls, premium tiers, or artificial limitations. Every feature is available from day one
- **Multiple AI Providers** - Choose from OpenAI, Anthropic, Google Gemini, or OpenRouter based on your needs and budget

Most cloud-based AI development platforms charge $20-100+ per month while limiting your usage and storing your intellectual property on their servers. With December, a $5 API credit can generate dozens of complete applications, and you keep full ownership of everything you create.

The local-first approach means you can work offline, modify the platform itself, and never worry about service outages or policy changes affecting your projects. Your development environment evolves with your needs, not a company's business model.

December proves that you don't need to choose between powerful AI assistance and maintaining control over your work. Run it locally, use your own API keys, and build without boundaries.

## Contact

Hi! Thanks for checking out and using this project. If you are interested in discussing your project, require mentorship, consider hiring me, or just wanna chat - I'm happy to talk.

You can send me an email to get in touch: j.schoen@mail.com or message me on Twitter: [@julianschoen](https://twitter.com/julianschoen)

Thanks and have an awesome day 👋

## Disclaimer

December, is an experimental application and is provided "as-is" without any warranty, express or implied. By using this software, you agree to assume all risks associated with its use, including but not limited to data loss, system failure, or any other issues that may arise.

The developers and contributors of this project do not accept any responsibility or liability for any losses, damages, or other consequences that may occur as a result of using this software. You are solely responsible for any decisions and actions taken based on the information provided by December.

Please note that the use of the large language models can be expensive due to its token usage. By utilizing this project, you acknowledge that you are responsible for monitoring and managing your own token usage and the associated costs. It is highly recommended to check your API usage regularly and set up any necessary limits or alerts to prevent unexpected charges.

By using December, you agree to indemnify, defend, and hold harmless the developers, contributors, and any affiliated parties from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use of this software or your violation of these terms.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.