# Neon AI Service

AI-powered features gateway and processor for the core platform.

## Features

- Code generation and analysis
- Smart suggestions
- Document processing
- Natural language queries
- Integration with MCP server

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## API Endpoints

- `POST /api/neon/chat` - Chat with AI
- `POST /api/neon/code-gen` - Generate code
- `POST /api/neon/analyze` - Analyze code/documents
- `GET /api/neon/health` - Health check

## Architecture

Neon Service acts as a gateway between the frontend and AI providers,
with MCP server handling specialized AI operations.
