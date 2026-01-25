export const dataAnalysisTool = {
  name: 'dataAnalysis',
  description: 'AI tool for dataAnalysis',
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
        text: 'Placeholder response for dataAnalysis'
      }]
    };
  }
};
