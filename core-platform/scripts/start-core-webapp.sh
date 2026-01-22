#!/bin/bash

# Start Core Webapp (React + Vite)
# Port: 3002

echo "🚀 Starting Core Webapp (React + Vite)..."
echo "Port: 3002"
echo "URL: http://localhost:3002"
echo ""

cd "$(dirname "$0")/../apps/core-webapp"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

echo "Starting Vite dev server..."
echo "Press Ctrl+C to stop"
echo ""

pnpm dev
