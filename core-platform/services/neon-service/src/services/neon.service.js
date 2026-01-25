import axios from 'axios';
import { logger } from '../config/logger.js';
import { MCPClient } from '../mcp/client.js';
import { AIProvider } from './ai.provider.js';

export class NeonService {
  constructor() {
    this.mcpClient = new MCPClient();
    this.aiProvider = new AIProvider();
  }

  async chat({ message, context, model, userId, conversationHistory = [] }) {
    logger.info(`Chat request from user ${userId}`);
    
    try {
      // Build messages array for AI
      const messages = [
        {
          role: 'system',
          content: this.aiProvider.buildSystemPrompt()
        },
        // Add conversation history
        ...conversationHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })),
        // Add current message with context
        {
          role: 'user',
          content: this.aiProvider.buildContextualPrompt(message, context)
        }
      ];

      // Get AI response
      const response = await this.aiProvider.chat({
        messages,
        model: model || 'gpt-4'
      });

      return {
        message: response.content,
        model: response.model,
        usage: response.usage,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Chat error:', error);
      
      // Fallback to mock response if AI fails
      return {
        message: this.getMockResponse(message, context),
        model: 'mock',
        timestamp: new Date().toISOString()
      };
    }
  }

  getMockResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('task') && lowerMessage.includes('create')) {
      return '✓ I can help you create a task! To create a task, I need:\n\n1. Task name\n2. Project (use ^ProjectName)\n3. Assignee (use @username)\n4. Due date (optional)\n\nExample: "Create task \\"Fix login bug\\" in ^Frontend assigned to @john due tomorrow"';
    }
    
    if (lowerMessage.includes('my task') || lowerMessage.includes('show task')) {
      return '📋 Here are your tasks:\n\n🔴 High Priority:\n• #123 - Complete Q4 Review (Due: Tomorrow)\n• #456 - Fix login bug (Due: Today)\n\n🟡 Medium Priority:\n• #789 - Update docs (Due: Friday)\n\nWould you like details on any specific task?';
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('hours')) {
      return '⏱️ Time Summary:\n\n📊 This Week: 32.5 hours\n📈 Today: 6.5 hours\n🎯 Target: 40 hours/week\n\n🔥 Currently tracking: #456 (2h 15m)';
    }
    
    return 'I can help you with:\n\n💬 Messaging: "Ask @user about #123"\n📋 Tasks: "Create task \\"name\\" in ^Project"\n📅 Meetings: "Schedule meeting with @user1"\n📊 Status: "What\'s the status of #456?"\n⏱️ Time: "Show my time for today"\n\nWhat would you like to do?';
  }

  async chatStream({ message, context, model, userId, onChunk }) {
    logger.info(`Chat stream request from user ${userId}`);
    
    // Implement streaming via MCP or direct AI provider
    // For now, simulate streaming
    const response = await this.chat({ message, context, model, userId });
    
    const words = response.message.split(' ');
    for (const word of words) {
      onChunk({ content: word + ' ' });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  async generateCode({ prompt, language, framework, userId }) {
    logger.info(`Code generation request from user ${userId}`);
    
    const result = await this.mcpClient.executeTool('generate_code', {
      prompt,
      language: language || 'javascript',
      framework,
      userId
    });

    return result.code;
  }

  async explainCode({ code, language, userId }) {
    logger.info(`Code explanation request from user ${userId}`);
    
    const result = await this.mcpClient.executeTool('explain_code', {
      code,
      language,
      userId
    });

    return result.explanation;
  }

  async reviewCode({ code, language, context, userId }) {
    logger.info(`Code review request from user ${userId}`);
    
    const result = await this.mcpClient.executeTool('review_code', {
      code,
      language,
      context,
      userId
    });

    return result.review;
  }

  async analyzeDocument({ document, type, userId }) {
    logger.info(`Document analysis request from user ${userId}`);
    
    const result = await this.mcpClient.executeTool('analyze_document', {
      document,
      type,
      userId
    });

    return result.analysis;
  }

  async analyzeData({ data, query, userId }) {
    logger.info(`Data analysis request from user ${userId}`);
    
    const result = await this.mcpClient.executeTool('analyze_data', {
      data,
      query,
      userId
    });

    return result.analysis;
  }

  async getSuggestions({ context, type, userId }) {
    logger.info(`Suggestions request from user ${userId}`);
    
    const result = await this.mcpClient.executeTool('get_suggestions', {
      context,
      type,
      userId
    });

    return result.suggestions;
  }

  async autocomplete({ prefix, context, language, userId }) {
    logger.info(`Autocomplete request from user ${userId}`);
    
    const result = await this.mcpClient.executeTool('autocomplete', {
      prefix,
      context,
      language,
      userId
    });

    return result.completions;
  }
}
