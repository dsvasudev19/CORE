export const autocompleteTool = {
  name: 'autocomplete',
  description: 'AI tool for autocomplete',
  inputSchema: {
    type: 'object',
    properties: {
      data: { type: 'string', description: 'Input data' },
      userId: { type: 'string', description: 'User ID' }
    },
    required: ['data']
  },
  async execute(args) {
    return {
      content: [{
        type: 'text',
        text: 'Placeholder response for autocomplete'
      }]
    };
  }
};
