#!/bin/bash

# Start All Services
# This script starts all three services in separate terminal windows/tabs

echo "🚀 Starting All Services..."
echo ""
echo "Services:"
echo "  1. Core Service (Spring Boot)    - Port 8080"
echo "  2. Messaging Service (Node.js)   - Port 3001"
echo "  3. Core Webapp (React + Vite)    - Port 3002"
echo ""

SCRIPT_DIR="$(dirname "$0")"
ROOT_DIR="$SCRIPT_DIR/.."

# Detect OS
OS="$(uname -s)"

case "$OS" in
    Darwin)
        # macOS - Use Terminal.app or iTerm2
        echo "Detected macOS"
        echo "Opening services in new Terminal tabs..."
        
        # Core Service
        osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR' && ./scripts/start-core-service.sh\""
        sleep 2
        
        # Messaging Service
        osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR' && ./scripts/start-messaging-service.sh\""
        sleep 2
        
        # Core Webapp
        osascript -e "tell application \"Terminal\" to do script \"cd '$ROOT_DIR' && ./scripts/start-core-webapp.sh\""
        
        echo ""
        echo "✓ All services started in separate Terminal tabs"
        ;;
        
    Linux)
        # Linux - Try different terminal emulators
        echo "Detected Linux"
        
        if command -v gnome-terminal &> /dev/null; then
            echo "Using gnome-terminal..."
            gnome-terminal --tab --title="Core Service" -- bash -c "cd '$ROOT_DIR' && ./scripts/start-core-service.sh; exec bash"
            gnome-terminal --tab --title="Messaging Service" -- bash -c "cd '$ROOT_DIR' && ./scripts/start-messaging-service.sh; exec bash"
            gnome-terminal --tab --title="Core Webapp" -- bash -c "cd '$ROOT_DIR' && ./scripts/start-core-webapp.sh; exec bash"
        elif command -v konsole &> /dev/null; then
            echo "Using konsole..."
            konsole --new-tab -e bash -c "cd '$ROOT_DIR' && ./scripts/start-core-service.sh; exec bash" &
            konsole --new-tab -e bash -c "cd '$ROOT_DIR' && ./scripts/start-messaging-service.sh; exec bash" &
            konsole --new-tab -e bash -c "cd '$ROOT_DIR' && ./scripts/start-core-webapp.sh; exec bash" &
        elif command -v xterm &> /dev/null; then
            echo "Using xterm..."
            xterm -e "cd '$ROOT_DIR' && ./scripts/start-core-service.sh" &
            xterm -e "cd '$ROOT_DIR' && ./scripts/start-messaging-service.sh" &
            xterm -e "cd '$ROOT_DIR' && ./scripts/start-core-webapp.sh" &
        else
            echo "No supported terminal emulator found."
            echo "Please run services manually or use tmux/screen."
            exit 1
        fi
        
        echo ""
        echo "✓ All services started in separate terminal windows"
        ;;
        
    MINGW*|MSYS*|CYGWIN*)
        # Windows (Git Bash, MSYS2, Cygwin)
        echo "Detected Windows"
        echo "Starting services in background..."
        
        # Start services in background
        cd "$ROOT_DIR"
        start cmd /k "cd services\core-service && mvnw.cmd spring-boot:run"
        sleep 3
        start cmd /k "cd services\messaging-service && pnpm dev"
        sleep 2
        start cmd /k "cd apps\core-webapp && pnpm dev"
        
        echo ""
        echo "✓ All services started in separate Command Prompt windows"
        ;;
        
    *)
        echo "Unknown OS: $OS"
        echo "Please run services manually:"
        echo "  Terminal 1: ./scripts/start-core-service.sh"
        echo "  Terminal 2: ./scripts/start-messaging-service.sh"
        echo "  Terminal 3: ./scripts/start-core-webapp.sh"
        exit 1
        ;;
esac

echo ""
echo "📍 Service URLs:"
echo "  Core Service:      http://localhost:8080"
echo "  Core Service API:  http://localhost:8080/swagger-ui.html"
echo "  Messaging Service: http://localhost:3001"
echo "  Core Webapp:       http://localhost:3002"
echo ""
echo "💡 To stop all services:"
echo "  - Close the terminal tabs/windows"
echo "  - Or press Ctrl+C in each terminal"
echo ""
echo "✅ All services are starting up..."
echo "   Please wait 30-60 seconds for all services to be ready."
