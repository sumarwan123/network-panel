#!/bin/bash

# NETWORK PANEL - Startup Script
# Usage: ./start.sh [dev|prod]

MODE=${1:-dev}
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_NC='\033[0m'

echo -e "${COLOR_BLUE}🌐 NETWORK PANEL - Startup Script${COLOR_NC}"
echo "=================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${COLOR_YELLOW}❌ Node.js is not installed${COLOR_NC}"
    exit 1
fi

echo -e "${COLOR_GREEN}✓ Node.js found: $(node --version)${COLOR_NC}"

# Check .env file
if [ ! -f .env ]; then
    echo -e "${COLOR_YELLOW}⚠️  .env file not found. Creating from .env.example...${COLOR_NC}"
    cp .env.example .env
    echo -e "${COLOR_YELLOW}⚠️  Please edit .env file with your credentials${COLOR_NC}"
fi

# Create data directory
mkdir -p data

if [ "$MODE" = "dev" ]; then
    echo -e "${COLOR_BLUE}🚀 Starting in DEVELOPMENT mode${COLOR_NC}"
    echo "=================================="
    echo -e "${COLOR_GREEN}Backend:  http://localhost:5000${COLOR_NC}"
    echo -e "${COLOR_GREEN}Frontend: http://localhost:3000${COLOR_NC}"
    echo -e "${COLOR_YELLOW}Press Ctrl+C to stop${COLOR_NC}"
    echo ""
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${COLOR_BLUE}📦 Installing backend dependencies...${COLOR_NC}"
        npm install
    fi
    
    if [ ! -d "frontend/node_modules" ]; then
        echo -e "${COLOR_BLUE}📦 Installing frontend dependencies...${COLOR_NC}"
        cd frontend
        npm install
        cd ..
    fi
    
    # Start servers
    echo -e "${COLOR_BLUE}🔥 Starting backend...${COLOR_NC}"
    npm start &
    BACKEND_PID=$!
    
    sleep 2
    
    echo -e "${COLOR_BLUE}🔥 Starting frontend...${COLOR_NC}"
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo -e "${COLOR_GREEN}✓ Both servers started!${COLOR_NC}"
    echo ""
    
    # Cleanup on exit
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
    wait

elif [ "$MODE" = "prod" ]; then
    echo -e "${COLOR_BLUE}🚀 Starting in PRODUCTION mode${COLOR_NC}"
    echo "=================================="
    
    # Build frontend
    if [ ! -d "frontend/build" ]; then
        echo -e "${COLOR_BLUE}🔨 Building frontend...${COLOR_NC}"
        cd frontend
        npm run build
        cd ..
    fi
    
    echo -e "${COLOR_GREEN}✓ Starting production server on port 3000${COLOR_NC}"
    NODE_ENV=production node backend/server.js
    
else
    echo -e "${COLOR_YELLOW}Usage: ./start.sh [dev|prod]${COLOR_NC}"
    exit 1
fi
