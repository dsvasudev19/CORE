#!/bin/bash

# Stop All Services
# This script stops all running services by killing processes on their ports

echo "🛑 Stopping All Services..."
echo ""

# Function to kill process on a port
kill_port() {
    local port=$1
    local service=$2
    
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "Stopping $service on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        echo "✓ $service stopped"
    else
        echo "ℹ️  $service not running on port $port"
    fi
}

# Stop each service
kill_port 3002 "Core Webapp"
kill_port 8080 "Core Service"
kill_port 3001 "Messaging Service"
kill_port 3000 "Marketing Website"

echo ""
echo "✅ All services stopped"
echo ""
echo "To start services again:"
echo "  ./scripts/start-all.sh"
echo "  or"
echo "  pnpm dev"
