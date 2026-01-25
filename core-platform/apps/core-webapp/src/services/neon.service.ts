import axios from 'axios';

const NEON_API_URL = import.meta.env.VITE_NEON_API_URL || 'http://localhost:3003/api/neon';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'action' | 'info' | 'error' | 'success';
  metadata?: {
    mentions?: string[];
    tasks?: string[];
    projects?: string[];
    action?: string;
  };
}

export interface ChatRequest {
  message: string;
  context?: {
    mentions?: string[];
    tasks?: string[];
    projects?: string[];
  };
  model?: string;
  conversationHistory?: Array<{
    content: string;
    isUser: boolean;
  }>;
}

export interface ChatResponse {
  message: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  timestamp: string;
}

class NeonService {
  private getAuthToken(): string {
    return localStorage.getItem('token') || '';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(
        `${NEON_API_URL}/chat`,
        request,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Neon chat error:', error);
      throw error;
    }
  }

  async chatStream(
    request: ChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${NEON_API_URL}/chat/stream`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              onChunk(parsed.content || '');
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Neon stream error:', error);
      throw error;
    }
  }

  async generateCode(prompt: string, language?: string, framework?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${NEON_API_URL}/code-gen`,
        { prompt, language, framework },
        { headers: this.getHeaders() }
      );
      return response.data.code;
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  }

  async explainCode(code: string, language?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${NEON_API_URL}/code-explain`,
        { code, language },
        { headers: this.getHeaders() }
      );
      return response.data.explanation;
    } catch (error) {
      console.error('Code explanation error:', error);
      throw error;
    }
  }

  async reviewCode(code: string, language?: string, context?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${NEON_API_URL}/code-review`,
        { code, language, context },
        { headers: this.getHeaders() }
      );
      return response.data.review;
    } catch (error) {
      console.error('Code review error:', error);
      throw error;
    }
  }

  async getSuggestions(context: any, type?: string): Promise<string[]> {
    try {
      const response = await axios.post(
        `${NEON_API_URL}/suggest`,
        { context, type },
        { headers: this.getHeaders() }
      );
      return response.data.suggestions;
    } catch (error) {
      console.error('Suggestions error:', error);
      throw error;
    }
  }

  async autocomplete(prefix: string, context?: any, language?: string): Promise<string[]> {
    try {
      const response = await axios.post(
        `${NEON_API_URL}/autocomplete`,
        { prefix, context, language },
        { headers: this.getHeaders() }
      );
      return response.data.completions;
    } catch (error) {
      console.error('Autocomplete error:', error);
      throw error;
    }
  }

  parseInput(text: string): { mentions: string[]; tasks: string[]; projects: string[] } {
    const mentions = (text.match(/@\w+/g) || []).map(m => m.substring(1));
    const tasks = (text.match(/#\d+/g) || []).map(t => t.substring(1));
    const projects = (text.match(/\^\w+/g) || []).map(p => p.substring(1));

    return { mentions, tasks, projects };
  }
}

export const neonService = new NeonService();
