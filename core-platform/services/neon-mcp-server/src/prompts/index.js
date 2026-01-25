export const prompts = [
  {
    name: 'code_review_prompt',
    description: 'Prompt for code review',
    arguments: [{ name: 'code', description: 'Code to review', required: true }],
    async get(args) {
      return {
        messages: [{
          role: 'user',
          content: { type: 'text', text: `Review this code:\n\n${args.code}` }
        }]
      };
    }
  }
];
