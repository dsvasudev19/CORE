#!/bin/bash

# Start Neon MCP Server

echo "🔮 Starting Neon MCP Server..."

cd "$(dirname "$0")/../services/neon-mcp-server" || exit

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the MCP server
echo "✨ Starting Neon MCP Server..."
npm run dev
