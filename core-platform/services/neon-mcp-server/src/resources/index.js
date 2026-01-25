export const resources = [
  {
    uri: 'neon://docs/api',
    name: 'API Documentation',
    description: 'Neon AI API documentation',
    mimeType: 'text/plain',
    async read() {
      return {
        contents: [{
          uri: 'neon://docs/api',
          mimeType: 'text/plain',
          text: 'Neon AI API Documentation\n\n[Documentation content here]'
        }]
      };
    }
  }
];
