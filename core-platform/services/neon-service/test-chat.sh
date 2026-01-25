#!/bin/bash

echo "🧪 Testing Neon AI Chat Service..."
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:3003/health | jq '.'
echo ""

# Note: Chat endpoint requires authentication
echo "2. Chat endpoint requires JWT authentication"
echo "   To test: Login to the app and use the chat UI"
echo ""

echo "✅ Basic health check complete!"
echo "🚀 Start the service with: ./scripts/start-neon-service.sh"
