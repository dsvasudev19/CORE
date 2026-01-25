#!/bin/bash

# Start Neon AI Service

echo "🚀 Starting Neon AI Service..."

cd "$(dirname "$0")/../services/neon-service" || exit

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Please update .env with your configuration"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the service
echo "✨ Starting Neon Service on port 3003..."
npm run dev
