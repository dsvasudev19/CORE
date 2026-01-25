import express from 'express';
import {NeonController} from '../controllers/neon.controller.js';

const router = express.Router();
const neonController = new NeonController();

// Chat endpoints
router.post('/chat', neonController.chat);
router.post('/chat/stream', neonController.chatStream);

// Code generation
router.post('/code-gen', neonController.generateCode);
router.post('/code-explain', neonController.explainCode);
router.post('/code-review', neonController.reviewCode);

// Analysis
router.post('/analyze-document', neonController.analyzeDocument);
router.post('/analyze-data', neonController.analyzeData);

// Smart suggestions
router.post('/suggest', neonController.getSuggestions);
router.post('/autocomplete', neonController.autocomplete);

// MCP tools
router.get('/tools', neonController.listTools);
router.post('/tools/:toolName', neonController.executeTool);

export default router;
