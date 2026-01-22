#!/bin/bash

# Core Platform Setup Script
# This script helps you set up the entire monorepo quickly

set -e

echo "🚀 Core Platform Setup"
echo "====================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠ pnpm is not installed. Installing...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✓ pnpm $(pnpm --version)${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${YELLOW}⚠ Java is not installed${NC}"
    echo "Java 17 is required for core-service"
    echo "Install from: https://adoptium.net/"
else
    echo -e "${GREEN}✓ Java $(java -version 2>&1 | head -n 1)${NC}"
fi

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠ MySQL client is not installed${NC}"
    echo "You can use Docker instead: docker-compose up -d mysql"
else
    echo -e "${GREEN}✓ MySQL client installed${NC}"
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🗄️  Database Setup"
echo "Choose an option:"
echo "1) Use Docker (recommended)"
echo "2) Use existing MySQL installation"
echo "3) Skip database setup"
read -p "Enter choice [1-3]: " db_choice

case $db_choice in
    1)
        echo "Starting MySQL with Docker..."
        if command -v docker-compose &> /dev/null; then
            docker-compose up -d mysql
            echo "Waiting for MySQL to be ready..."
            sleep 15
            echo -e "${GREEN}✓ MySQL started${NC}"
        else
            echo -e "${RED}❌ docker-compose not found${NC}"
            exit 1
        fi
        ;;
    2)
        echo "Using existing MySQL installation"
        echo "Please ensure MySQL is running and databases are created:"
        echo "  - core_db"
        echo "  - messaging_app_dev"
        ;;
    3)
        echo "Skipping database setup"
        ;;
esac

echo ""
echo "⚙️  Setting up environment files..."

# Core Webapp
if [ ! -f "apps/core-webapp/.env" ]; then
    cp apps/core-webapp/.env.example apps/core-webapp/.env
    echo -e "${GREEN}✓ Created apps/core-webapp/.env${NC}"
else
    echo -e "${YELLOW}⚠ apps/core-webapp/.env already exists${NC}"
fi

# Messaging Service
if [ ! -f "services/messaging-service/.env" ]; then
    cp services/messaging-service/.env.example services/messaging-service/.env
    echo -e "${GREEN}✓ Created services/messaging-service/.env${NC}"
else
    echo -e "${YELLOW}⚠ services/messaging-service/.env already exists${NC}"
fi

# Run migrations if database was set up
if [ "$db_choice" != "3" ]; then
    echo ""
    echo "🔄 Running database migrations..."
    cd services/messaging-service
    pnpm db:migrate
    echo -e "${GREEN}✓ Migrations completed${NC}"
    
    read -p "Do you want to seed the database with sample data? (y/n): " seed_choice
    if [ "$seed_choice" = "y" ]; then
        pnpm db:seed
        echo -e "${GREEN}✓ Database seeded${NC}"
    fi
    cd ../..
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎉 You're all set! Here's what you can do next:"
echo ""
echo "Start all services:"
echo "  ${GREEN}pnpm dev${NC}"
echo ""
echo "Start specific services:"
echo "  ${GREEN}pnpm dev:webapp${NC}      # Core webapp (Port 3002)"
echo "  ${GREEN}pnpm dev:core${NC}        # Core service (Port 8080)"
echo "  ${GREEN}pnpm dev:messaging${NC}   # Messaging service (Port 3001)"
echo ""
echo "Access the applications:"
echo "  🌐 Marketing Site:  ${GREEN}http://localhost:3000${NC}"
echo "  💼 Core Webapp:     ${GREEN}http://localhost:3002${NC}"
echo "  📡 Core API:        ${GREEN}http://localhost:8080${NC}"
echo "  💬 Messaging API:   ${GREEN}http://localhost:3001${NC}"
echo ""
echo "For more information, see:"
echo "  📖 README.md"
echo "  🚀 QUICK_START.md"
echo "  🛠️  DEVELOPMENT.md"
echo ""
