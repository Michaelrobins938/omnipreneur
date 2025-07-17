#!/bin/bash

# Omnipreneur AI Suite - Production Deployment Script
# This script automates the deployment process for the market-ready web application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="omnipreneur-ai-suite"
DEPLOYMENT_ENV=${1:-production}
MAIN_APP_DIR="organized/main-app"

echo -e "${BLUE}🚀 Omnipreneur AI Suite - Production Deployment${NC}"
echo -e "${BLUE}===============================================${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if Docker is installed (for containerized deployment)
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Containerized deployment will be skipped."
    fi
    
    print_status "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    cd "$MAIN_APP_DIR"
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm ci --only=production
    
    print_status "Dependencies installed successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    cd "$MAIN_APP_DIR"
    
    # Run linting
    npm run lint
    
    # Run type checking
    npm run type-check
    
    # Run unit tests
    npm run test -- --passWithNoTests
    
    print_status "All tests passed"
}

# Build application
build_application() {
    print_status "Building application..."
    
    cd "$MAIN_APP_DIR"
    
    # Generate Prisma client
    npx prisma generate
    
    # Build the application
    npm run build
    
    print_status "Application built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    cd "$MAIN_APP_DIR"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    vercel --prod --yes
    
    print_status "Deployed to Vercel successfully"
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    cd "$MAIN_APP_DIR"
    
    # Build Docker image
    docker build -t "$PROJECT_NAME:$DEPLOYMENT_ENV" .
    
    # Stop existing containers
    docker-compose down || true
    
    # Start services
    docker-compose up -d
    
    print_status "Docker deployment completed"
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    cd "$MAIN_APP_DIR"
    
    # Copy environment template if .env.local doesn't exist
    if [ ! -f .env.local ]; then
        cp env.example .env.local
        print_warning "Environment file created. Please edit .env.local with your configuration"
    fi
    
    print_status "Environment setup completed"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    cd "$MAIN_APP_DIR"
    
    # Generate Prisma client
    npx prisma generate
    
    # Push database schema
    npx prisma db push
    
    print_status "Database setup completed"
}

# Performance optimization
optimize_performance() {
    print_status "Optimizing performance..."
    
    cd "$MAIN_APP_DIR"
    
    # Analyze bundle size
    npm run analyze
    
    # Clean build cache
    rm -rf .next
    
    print_status "Performance optimization completed"
}

# Security check
security_check() {
    print_status "Running security checks..."
    
    cd "$MAIN_APP_DIR"
    
    # Run security audit
    npm audit --audit-level moderate
    
    print_status "Security checks completed"
}

# Main deployment function
main() {
    echo -e "${BLUE}Starting deployment for environment: $DEPLOYMENT_ENV${NC}"
    
    # Check prerequisites
    check_prerequisites
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Security check
    security_check
    
    # Build application
    build_application
    
    # Optimize performance
    optimize_performance
    
    # Setup database
    setup_database
    
    # Deploy based on environment
    case $DEPLOYMENT_ENV in
        "vercel")
            deploy_vercel
            ;;
        "docker")
            deploy_docker
            ;;
        "production")
            deploy_vercel
            ;;
        *)
            print_warning "Unknown deployment environment: $DEPLOYMENT_ENV"
            print_status "Build completed successfully. Manual deployment required."
            ;;
    esac
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}Your Omnipreneur AI Suite is now live and ready for market!${NC}"
}

# Run main function
main "$@" 