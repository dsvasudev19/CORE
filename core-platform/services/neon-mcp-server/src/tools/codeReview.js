export const codeReviewTool = {
  name: 'codeReview',
  description: 'AI tool for codeReview',
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
        text: 'Placeholder response for codeReview'
      }]
    };
  }
};
