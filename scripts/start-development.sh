#!/bin/bash

# Development Environment Startup Script
# This script starts all necessary services for local development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Omnipreneur AI Suite Development Environment${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    echo -e "${BLUE}🔍 Checking requirements...${NC}"
    
    required_tools=("node" "npm")
    
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            print_error "$tool is not installed"
            exit 1
        fi
    done
    
    # Check Node.js version
    node_version=$(node --version | cut -d'v' -f2)
    required_version="18.0.0"
    
    if ! npm --version &> /dev/null; then
        print_error "npm is not working properly"
        exit 1
    fi
    
    print_status "Requirements check passed"
}

# Check environment file
check_environment() {
    echo -e "${BLUE}🔧 Checking environment configuration...${NC}"
    
    if [[ ! -f ".env.local" && ! -f ".env" ]]; then
        if [[ -f "env.example" ]]; then
            print_warning "No .env file found. Creating from env.example..."
            cp env.example .env.local
            echo -e "${YELLOW}Please update .env.local with your actual configuration values${NC}"
        else
            print_warning "No environment file found. Please create .env.local"
        fi
    else
        print_status "Environment file found"
    fi
}

# Install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    if [[ ! -d "node_modules" ]] || [[ package.json -nt node_modules ]]; then
        if command -v pnpm &> /dev/null; then
            pnpm install
        elif command -v yarn &> /dev/null; then
            yarn install
        else
            npm install
        fi
        print_status "Dependencies installed"
    else
        print_status "Dependencies already up to date"
    fi
}

# Setup database
setup_database() {
    echo -e "${BLUE}🗄️  Setting up database...${NC}"
    
    if [[ -f "prisma/schema.prisma" ]]; then
        # Generate Prisma client
        echo "Generating Prisma client..."
        npx prisma generate
        
        # Check if database exists and run migrations
        if npm run db:push &> /dev/null; then
            print_status "Database setup completed"
        else
            print_warning "Database setup failed - please check your DATABASE_URL"
        fi
    else
        print_warning "No Prisma schema found, skipping database setup"
    fi
}

# Start WebSocket server in background
start_websocket() {
    echo -e "${BLUE}🔌 Starting WebSocket server...${NC}"
    
    if [[ -f "server/websocket-server.js" ]]; then
        # Kill existing WebSocket server if running
        pkill -f "websocket-server.js" 2>/dev/null || true
        
        # Start WebSocket server
        node server/websocket-server.js &
        WS_PID=$!
        echo $WS_PID > .ws-pid
        
        # Wait a moment for server to start
        sleep 2
        
        if kill -0 $WS_PID 2>/dev/null; then
            print_status "WebSocket server started (PID: $WS_PID)"
        else
            print_error "Failed to start WebSocket server"
        fi
    else
        print_warning "WebSocket server not found, skipping"
    fi
}

# Start main application
start_application() {
    echo -e "${BLUE}🌐 Starting Next.js application...${NC}"
    
    print_status "Starting development server..."
    echo -e "${GREEN}🎉 Development environment is ready!${NC}"
    echo -e "${GREEN}📱 Open http://localhost:3000 in your browser${NC}"
    echo -e "${GREEN}🔌 WebSocket server: ws://localhost:3001${NC}"
    echo
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    
    # Setup trap to clean up on exit
    trap cleanup EXIT INT TERM
    
    # Start Next.js development server
    npm run dev
}

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    
    # Kill WebSocket server
    if [[ -f ".ws-pid" ]]; then
        WS_PID=$(cat .ws-pid)
        if kill -0 $WS_PID 2>/dev/null; then
            kill $WS_PID
            print_status "WebSocket server stopped"
        fi
        rm -f .ws-pid
    fi
    
    # Kill any remaining Node.js processes for this project
    pkill -f "websocket-server.js" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Health check
health_check() {
    echo -e "${BLUE}🏥 Running health check...${NC}"
    
    # Check if ports are available
    if lsof -i:3000 &> /dev/null; then
        print_warning "Port 3000 is already in use"
    fi
    
    if lsof -i:3001 &> /dev/null; then
        print_warning "Port 3001 is already in use"
    fi
    
    # Check environment variables
    if [[ -z "$DATABASE_URL" ]] && [[ -f ".env.local" ]]; then
        if ! grep -q "DATABASE_URL" .env.local; then
            print_warning "DATABASE_URL not found in environment"
        fi
    fi
    
    print_status "Health check completed"
}

# Show helpful information
show_info() {
    echo -e "${BLUE}ℹ️  Development Information${NC}"
    echo
    echo -e "${GREEN}Available Scripts:${NC}"
    echo -e "  npm run dev          - Start development server"
    echo -e "  npm run build        - Build for production"
    echo -e "  npm run test         - Run tests"
    echo -e "  npm run lint         - Run linter"
    echo -e "  npm run db:studio    - Open Prisma Studio"
    echo -e "  npm run ws:dev       - Start WebSocket server only"
    echo
    echo -e "${GREEN}Useful URLs:${NC}"
    echo -e "  Application:         http://localhost:3000"
    echo -e "  WebSocket:           ws://localhost:3001"
    echo -e "  Database Studio:     http://localhost:5555 (when running)"
    echo
    echo -e "${GREEN}Environment Files:${NC}"
    echo -e "  .env.local           - Local environment variables"
    echo -e "  env.example          - Example environment file"
    echo
}

# Main function
main() {
    check_requirements
    check_environment
    install_dependencies
    setup_database
    health_check
    show_info
    start_websocket
    start_application
}

# Handle script arguments
case "${1:-start}" in
    "start")
        main
        ;;
    "info")
        show_info
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 [start|info|health|cleanup]"
        echo
        echo "Commands:"
        echo "  start   - Start the development environment (default)"
        echo "  info    - Show development information"
        echo "  health  - Run health check"
        echo "  cleanup - Clean up running processes"
        exit 1
        ;;
esac