#!/bin/bash

# Start Messaging Service (Node.js + Express + Socket.IO)
# Port: 3001

echo "🚀 Starting Messaging Service (Node.js)..."
echo "Port: 3001"
echo "URL: http://localhost:3001"
echo ""

cd "$(dirname "$0")/../services/messaging-service"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✓ Created .env file. Please update database credentials if needed."
fi

echo "Starting Node.js server with nodemon..."
echo "Press Ctrl+C to stop"
echo ""

pnpm dev
