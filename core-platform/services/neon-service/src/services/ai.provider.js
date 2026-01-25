import axios from 'axios';
import { logger } from '../config/logger.js';

export class AIProvider {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai';
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
  }

  async chat({ messages, model, stream = false }) {
    if (this.provider === 'openai') {
      return this.chatOpenAI({ messages, model, stream });
    } else if (this.provider === 'anthropic') {
      return this.chatAnthropic({ messages, model, stream });
    }
    throw new Error(`Unsupported AI provider: ${this.provider}`);
  }

  async chatOpenAI({ messages, model = 'gpt-4', stream = false }) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages,
          stream,
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        content: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage
      };
    } catch (error) {
      logger.error('OpenAI API error:', error.response?.data || error.message);
      throw new Error('Failed to get AI response from OpenAI');
    }
  }

  async chatAnthropic({ messages, model = 'claude-3-sonnet-20240229', stream = false }) {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model,
          messages,
          max_tokens: 1000,
          stream
        },
        {
          headers: {
            'x-api-key': this.anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        content: response.data.content[0].text,
        model: response.data.model,
        usage: response.data.usage
      };
    } catch (error) {
      logger.error('Anthropic API error:', error.response?.data || error.message);
      throw new Error('Failed to get AI response from Anthropic');
    }
  }

  buildSystemPrompt() {
    return `You are CORE AI Assistant, an intelligent assistant integrated into the CORE platform - an enterprise management system.

You can help users with:
- Task management (@mentions, #task-ids, ^project-names)
- Project information and status
- Time tracking and attendance
- Leave requests and balances
- Team collaboration
- Meeting scheduling
- Document queries
- Performance metrics

When users mention:
- @username - refers to a team member
- #123 - refers to a task ID
- ^ProjectName - refers to a project

Provide concise, actionable responses. Use emojis sparingly for clarity. Format responses with bullet points and sections when appropriate.

Current context: Employee dashboard in CORE platform.`;
  }

  parseUserContext(context) {
    // Extract mentions, tasks, projects from context
    const mentions = context?.mentions || [];
    const tasks = context?.tasks || [];
    const projects = context?.projects || [];

    return {
      mentions,
      tasks,
      projects,
      hasContext: mentions.length > 0 || tasks.length > 0 || projects.length > 0
    };
  }

  buildContextualPrompt(userMessage, context) {
    const parsed = this.parseUserContext(context);
    let prompt = userMessage;

    if (parsed.hasContext) {
      prompt += '\n\nContext:';
      if (parsed.mentions.length > 0) {
        prompt += `\n- Mentioned users: ${parsed.mentions.join(', ')}`;
      }
      if (parsed.tasks.length > 0) {
        prompt += `\n- Referenced tasks: ${parsed.tasks.join(', ')}`;
      }
      if (parsed.projects.length > 0) {
        prompt += `\n- Referenced projects: ${parsed.projects.join(', ')}`;
      }
    }

    return prompt;
  }
}
