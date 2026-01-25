export const suggestionsTool = {
  name: 'suggestions',
  description: 'AI tool for suggestions',
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
        text: 'Placeholder response for suggestions'
      }]
    };
  }
};
