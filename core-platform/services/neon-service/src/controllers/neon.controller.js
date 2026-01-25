import {NeonService} from '../services/neon.service.js';
import {MCPClient} from '../mcp/client.js';
import {logger} from '../config/logger.js';
import {AppError} from '../middleware/errorHandler.js';

export class NeonController {
  constructor() {
    this.neonService = new NeonService();
    this.mcpClient = new MCPClient();
  }

  chat = async (req, res, next) => {
    try {
      const {message, context, model, conversationHistory} = req.body;

      if (!message) {
        throw new AppError('Message is required', 400);
      }

      const response = await this.neonService.chat({
        message,
        context,
        model,
        userId: req.user.id,
        conversationHistory: conversationHistory || []
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  chatStream = async (req, res, next) => {
    try {
      const {message, context, model} = req.body;

      if (!message) {
        throw new AppError('Message is required', 400);
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      await this.neonService.chatStream({
        message,
        context,
        model,
        userId: req.user.id,
        onChunk: (chunk) => {
          res.write(`data: ${ JSON.stringify(chunk) }\n\n`);
        }
      });

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      next(error);
    }
  };

  generateCode = async (req, res, next) => {
    try {
      const {prompt, language, framework} = req.body;

      if (!prompt) {
        throw new AppError('Prompt is required', 400);
      }

      const code = await this.neonService.generateCode({
        prompt,
        language,
        framework,
        userId: req.user.id
      });

      res.json({code});
    } catch (error) {
      next(error);
    }
  };

  explainCode = async (req, res, next) => {
    try {
      const {code, language} = req.body;

      if (!code) {
        throw new AppError('Code is required', 400);
      }

      const explanation = await this.neonService.explainCode({
        code,
        language,
        userId: req.user.id
      });

      res.json({explanation});
    } catch (error) {
      next(error);
    }
  };

  reviewCode = async (req, res, next) => {
    try {
      const {code, language, context} = req.body;

      if (!code) {
        throw new AppError('Code is required', 400);
      }

      const review = await this.neonService.reviewCode({
        code,
        language,
        context,
        userId: req.user.id
      });

      res.json({review});
    } catch (error) {
      next(error);
    }
  };

  analyzeDocument = async (req, res, next) => {
    try {
      const {document, type} = req.body;

      if (!document) {
        throw new AppError('Document is required', 400);
      }

      const analysis = await this.neonService.analyzeDocument({
        document,
        type,
        userId: req.user.id
      });

      res.json({analysis});
    } catch (error) {
      next(error);
    }
  };

  analyzeData = async (req, res, next) => {
    try {
      const {data, query} = req.body;

      if (!data) {
        throw new AppError('Data is required', 400);
      }

      const analysis = await this.neonService.analyzeData({
        data,
        query,
        userId: req.user.id
      });

      res.json({analysis});
    } catch (error) {
      next(error);
    }
  };

  getSuggestions = async (req, res, next) => {
    try {
      const {context, type} = req.body;

      const suggestions = await this.neonService.getSuggestions({
        context,
        type,
        userId: req.user.id
      });

      res.json({suggestions});
    } catch (error) {
      next(error);
    }
  };

  autocomplete = async (req, res, next) => {
    try {
      const {prefix, context, language} = req.body;

      if (!prefix) {
        throw new AppError('Prefix is required', 400);
      }

      const completions = await this.neonService.autocomplete({
        prefix,
        context,
        language,
        userId: req.user.id
      });

      res.json({completions});
    } catch (error) {
      next(error);
    }
  };

  listTools = async (req, res, next) => {
    try {
      const tools = await this.mcpClient.listTools();
      res.json({tools});
    } catch (error) {
      next(error);
    }
  };

  executeTool = async (req, res, next) => {
    try {
      const {toolName} = req.params;
      const {arguments: args} = req.body;

      const result = await this.mcpClient.executeTool(toolName, args);
      res.json({result});
    } catch (error) {
      next(error);
    }
  };
}
