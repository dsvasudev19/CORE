export const codeExplanationTool = {
  name: 'explain_code',
  description: 'Explain what a piece of code does',
  inputSchema: {
    type: 'object',
    properties: {
      code: { type: 'string', description: 'Code to explain' },
      language: { type: 'string', description: 'Programming language' },
      userId: { type: 'string', description: 'User ID' }
    },
    required: ['code']
  },
  async execute(args) {
    const { code, language } = args;
    return {
      content: [{
        type: 'text',
        text: `Code Explanation:\n\nThis ${language || 'code'} snippet performs the following:\n\n1. [Placeholder explanation]\n2. [Detailed analysis would go here]\n3. [Integration with AI model needed]`
      }]
    };
  }
};
