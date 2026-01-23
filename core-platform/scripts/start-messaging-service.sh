#!/bin/bash

# Start Messaging Service Script
# This script starts the messaging service with proper configuration

set -e

echo "🚀 Starting Messaging Service..."

# Navigate to messaging service directory
cd "$(dirname "$0")/../services/messaging-service"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check database connection
echo "🔍 Checking database connection..."
if ! mysql -h 127.0.0.1 -u root -e "USE messaging_app_dev;" 2>/dev/null; then
    echo "⚠️  Database 'messaging_app_dev' not found. Creating..."
    mysql -h 127.0.0.1 -u root -e "CREATE DATABASE IF NOT EXISTS messaging_app_dev;"
    echo "✅ Database created."
    
    echo "📊 Running migrations..."
    npm run db:migrate
fi

# Start the service
echo "🎯 Starting messaging service on port 3001..."
echo "📝 Logs will be written to logs/ directory"
echo ""
echo "✨ Messaging service is starting..."
echo "   - HTTP API: http://localhost:3001"
echo "   - Socket.IO: ws://localhost:3001"
echo "   - Health check: http://localhost:3001/health"
echo ""
echo "⚠️  Remember: This service should only receive requests from core-service!"
echo ""

npm run dev
