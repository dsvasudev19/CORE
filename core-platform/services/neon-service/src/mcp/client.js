import axios from 'axios';
import { logger } from '../config/logger.js';

export class MCPClient {
  constructor() {
    this.baseURL = process.env.MCP_SERVER_URL || 'http://localhost:3004';
    this.timeout = parseInt(process.env.MCP_SERVER_TIMEOUT) || 30000;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async listTools() {
    try {
      const response = await this.client.get('/tools');
      return response.data.tools;
    } catch (error) {
      logger.error('Error listing MCP tools:', error);
      throw new Error('Failed to list MCP tools');
    }
  }

  async executeTool(toolName, args) {
    try {
      logger.info(`Executing MCP tool: ${toolName}`);
      
      const response = await this.client.post('/tools/execute', {
        tool: toolName,
        arguments: args
      });

      return response.data;
    } catch (error) {
      logger.error(`Error executing MCP tool ${toolName}:`, error);
      throw new Error(`Failed to execute MCP tool: ${toolName}`);
    }
  }

  async getPrompts() {
    try {
      const response = await this.client.get('/prompts');
      return response.data.prompts;
    } catch (error) {
      logger.error('Error getting MCP prompts:', error);
      throw new Error('Failed to get MCP prompts');
    }
  }

  async getResources() {
    try {
      const response = await this.client.get('/resources');
      return response.data.resources;
    } catch (error) {
      logger.error('Error getting MCP resources:', error);
      throw new Error('Failed to get MCP resources');
    }
  }
}
