# Neon AI Service Architecture

## Overview

Neon is the AI-powered assistant integrated into the core platform. It consists of two main components:

1. **Neon Service** (Port 3003) - Gateway and API layer
2. **Neon MCP Server** (Stdio) - AI tools and capabilities via Model Context Protocol

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│                  Neon UI Components                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Neon Service (Node.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │  Services    │  │ MCP Client   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MCP Protocol (Stdio)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Neon MCP Server (@modelcontextprotocol/sdk)  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Tools     │  │   Prompts    │  │  Resources   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AI Providers (OpenAI, Anthropic, etc.)         │
└─────────────────────────────────────────────────────────────┘
```

## Components

### Neon Service (Gateway)

**Responsibilities:**
- Authentication and authorization
- Rate limiting
- Request validation
- Response formatting
- Logging and monitoring
- Integration with core-service

**Key Features:**
- RESTful API endpoints
- JWT authentication
- Error handling
- Request/response logging
- MCP client integration

### Neon MCP Server

**Responsibilities:**
- AI tool implementations
- Prompt management
- Resource handling
- Direct AI provider integration

**Key Features:**
- Model Context Protocol compliance
- Tool execution
- Prompt templates
- Resource management

## API Endpoints

### Chat
- `POST /api/neon/chat` - Standard chat
- `POST /api/neon/chat/stream` - Streaming chat

### Code Operations
- `POST /api/neon/code-gen` - Generate code
- `POST /api/neon/code-explain` - Explain code
- `POST /api/neon/code-review` - Review code

### Analysis
- `POST /api/neon/analyze-document` - Analyze documents
- `POST /api/neon/analyze-data` - Analyze data

### Smart Features
- `POST /api/neon/suggest` - Get suggestions
- `POST /api/neon/autocomplete` - Autocomplete

### MCP Tools
- `GET /api/neon/tools` - List available tools
- `POST /api/neon/tools/:toolName` - Execute tool

## MCP Tools

1. **chat** - AI chat assistant
2. **generate_code** - Code generation
3. **explain_code** - Code explanation
4. **review_code** - Code review
5. **analyze_document** - Document analysis
6. **analyze_data** - Data analysis
7. **get_suggestions** - Smart suggestions
8. **autocomplete** - Code autocomplete

## Initial Phase Features

### Phase 1: Core AI Features
- ✅ Chat interface
- ✅ Code generation
- ✅ Code explanation
- ✅ Code review
- ⏳ Document analysis
- ⏳ Data analysis

### Phase 2: Smart Features
- ⏳ Context-aware suggestions
- ⏳ Intelligent autocomplete
- ⏳ Natural language queries
- ⏳ Workflow automation

### Phase 3: Advanced Features
- ⏳ Custom AI agents
- ⏳ Multi-modal support
- ⏳ Fine-tuned models
- ⏳ Advanced analytics

## Configuration

### Environment Variables

**Neon Service:**
```env
PORT=3003
NODE_ENV=development
CORE_SERVICE_URL=http://localhost:8080
MCP_SERVER_URL=http://localhost:3004
JWT_SECRET=your-secret
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
```

**MCP Server:**
```env
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
LOG_LEVEL=info
```

## Security

- JWT authentication required for all endpoints
- Rate limiting per user
- Input validation
- Sanitized responses
- Audit logging

## Deployment

### Development
```bash
# Terminal 1 - Start MCP Server
./scripts/start-neon-mcp.sh

# Terminal 2 - Start Neon Service
./scripts/start-neon-service.sh
```

### Production
- Use PM2 or similar process manager
- Configure reverse proxy (nginx)
- Set up SSL/TLS
- Configure monitoring and alerts

## Integration with Core Platform

Neon integrates with:
- **Core Service** - User authentication, data access
- **Messaging Service** - Real-time notifications
- **Frontend** - React components for AI features

## Future Enhancements

- WebSocket support for real-time streaming
- Caching layer for common queries
- Custom model fine-tuning
- Multi-language support
- Voice interface
- Image generation
- Advanced analytics dashboard

---

**Version**: 1.0.0  
**Last Updated**: January 25, 2026
