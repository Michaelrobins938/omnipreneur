#!/bin/bash

# 🚀 Omnipreneur AI Suite - Production Deployment Script
# This script automates the deployment process for production environments

set -e  # Exit on any error

echo "🚀 Starting Omnipreneur AI Suite deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci --production=false
    print_success "Dependencies installed successfully"
}

# Run type checking
type_check() {
    print_status "Running TypeScript type checking..."
    npm run type-check
    print_success "Type checking passed"
}

# Run linting
lint_code() {
    print_status "Running ESLint..."
    npm run lint
    print_success "Linting passed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm test
    print_success "All tests passed"
}

# Build the application
build_app() {
    print_status "Building application for production..."
    npm run build
    print_success "Build completed successfully"
}

# Analyze bundle size
analyze_bundle() {
    print_status "Analyzing bundle size..."
    npm run analyze
    print_success "Bundle analysis completed"
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found. Please create it from env.example"
        print_status "Copying env.example to .env.local..."
        cp env.example .env.local
        print_warning "Please edit .env.local with your actual values"
        exit 1
    fi
    
    # Check for required environment variables
    required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env.local; then
            print_error "Missing required environment variable: ${var}"
            exit 1
        fi
    done
    
    print_success "Environment variables are configured"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    if command -v npx &> /dev/null; then
        npx prisma generate
        npx prisma db push
        print_success "Database setup completed"
    else
        print_warning "npx not available, skipping database setup"
    fi
}

# Security audit
security_audit() {
    print_status "Running security audit..."
    npm audit --audit-level=moderate
    print_success "Security audit completed"
}

# Performance check
performance_check() {
    print_status "Running performance checks..."
    
    # Check bundle size
    if [ -d ".next" ]; then
        bundle_size=$(du -sh .next | cut -f1)
        print_status "Bundle size: $bundle_size"
    fi
    
    print_success "Performance checks completed"
}

# Deploy to Vercel (if configured)
deploy_vercel() {
    if command -v vercel &> /dev/null; then
        print_status "Deploying to Vercel..."
        vercel --prod --yes
        print_success "Deployed to Vercel successfully"
    else
        print_warning "Vercel CLI not installed. Install with: npm i -g vercel"
    fi
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    check_dependencies
    check_env
    install_dependencies
    type_check
    lint_code
    run_tests
    build_app
    analyze_bundle
    setup_database
    security_audit
    performance_check
    
    print_success "🎉 Deployment preparation completed successfully!"
    print_status "Your application is ready for production deployment"
    
    # Ask if user wants to deploy to Vercel
    read -p "Do you want to deploy to Vercel? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_vercel
    fi
    
    print_status "Deployment script completed"
    print_status "Next steps:"
    print_status "1. Configure your production environment variables"
    print_status "2. Set up your domain and SSL certificate"
    print_status "3. Configure your database for production"
    print_status "4. Set up monitoring and analytics"
    print_status "5. Test all functionality in production"
}

# Run main function
main "$@" 