import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import {tools} from './tools/index.js';
import {prompts} from './prompts/index.js';
import {resources} from './resources/index.js';

dotenv.config();

class NeonMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'neon-mcp-server',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                    prompts: {},
                    resources: {}
                },
            }
        );

        this.setupHandlers();
    }

    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: tools.map(tool => ({
                name: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema
            }))
        }));

        // Execute tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const {name, arguments: args} = request.params;

            const tool = tools.find(t => t.name === name);
            if (!tool) {
                throw new Error(`Tool not found: ${ name }`);
            }

            return await tool.execute(args);
        });

        // List prompts
        this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
            prompts: prompts.map(prompt => ({
                name: prompt.name,
                description: prompt.description,
                arguments: prompt.arguments
            }))
        }));

        // Get prompt
        this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
            const {name, arguments: args} = request.params;

            const prompt = prompts.find(p => p.name === name);
            if (!prompt) {
                throw new Error(`Prompt not found: ${ name }`);
            }

            return await prompt.get(args);
        });

        // List resources
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: resources.map(resource => ({
                uri: resource.uri,
                name: resource.name,
                description: resource.description,
                mimeType: resource.mimeType
            }))
        }));

        // Read resource
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const {uri} = request.params;

            const resource = resources.find(r => r.uri === uri);
            if (!resource) {
                throw new Error(`Resource not found: ${ uri }`);
            }

            return await resource.read();
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Neon MCP Server running on stdio');
    }
}

const server = new NeonMCPServer();
server.run().catch(console.error);
