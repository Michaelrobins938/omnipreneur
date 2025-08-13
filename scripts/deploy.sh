#!/bin/bash

# Production Deployment Script for Omnipreneur AI Suite
# This script handles the complete deployment pipeline

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${DOMAIN:-"your-domain.com"}
ENVIRONMENT=${ENVIRONMENT:-"production"}
DB_MIGRATE=${DB_MIGRATE:-"true"}
RUN_TESTS=${RUN_TESTS:-"true"}
BUILD_STATIC=${BUILD_STATIC:-"true"}

echo -e "${BLUE}🚀 Starting Omnipreneur AI Suite Deployment${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"

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

# Check if required environment variables are set
check_environment() {
    echo -e "${BLUE}🔍 Checking environment configuration...${NC}"
    
    required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "OPENAI_API_KEY"
        "NEXT_PUBLIC_APP_URL"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo -e "${RED}  - $var${NC}"
        done
        echo
        echo -e "${YELLOW}Please set these variables before deploying.${NC}"
        echo -e "${YELLOW}You can copy env.example and update the values.${NC}"
        exit 1
    fi
    
    print_status "Environment configuration check passed"
}

# Install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    if command -v pnpm &> /dev/null; then
        pnpm install --frozen-lockfile
    elif command -v yarn &> /dev/null; then
        yarn install --frozen-lockfile
    else
        npm ci
    fi
    
    print_status "Dependencies installed"
}

# Run tests
run_tests() {
    if [[ "$RUN_TESTS" == "true" ]]; then
        echo -e "${BLUE}🧪 Running tests...${NC}"
        
        # Type checking
        echo "Running TypeScript type check..."
        npm run type-check
        
        # Linting
        echo "Running linter..."
        npm run lint
        
        # Unit tests
        if [[ -f "jest.config.js" ]]; then
            echo "Running unit tests..."
            npm test -- --passWithNoTests
        fi
        
        # Mobile tests (if enabled)
        if [[ "$ENVIRONMENT" == "staging" ]]; then
            echo "Running mobile optimization tests..."
            node scripts/mobile-test.js || print_warning "Mobile tests failed but continuing deployment"
        fi
        
        print_status "Tests completed"
    else
        print_warning "Tests skipped"
    fi
}

# Database operations
setup_database() {
    if [[ "$DB_MIGRATE" == "true" ]]; then
        echo -e "${BLUE}🗄️  Setting up database...${NC}"
        
        # Generate Prisma client
        echo "Generating Prisma client..."
        npx prisma generate
        
        # Run migrations
        if [[ "$ENVIRONMENT" == "production" ]]; then
            echo "Deploying database migrations..."
            npx prisma migrate deploy
        else
            echo "Running database migrations..."
            npx prisma migrate dev
        fi
        
        print_status "Database setup completed"
    else
        print_warning "Database migrations skipped"
    fi
}

# Build application
build_application() {
    if [[ "$BUILD_STATIC" == "true" ]]; then
        echo -e "${BLUE}🏗️  Building application...${NC}"
        
        # Set production environment variables
        export NODE_ENV=production
        export NEXT_PUBLIC_WS_URL="wss://${DOMAIN}"
        
        # Build the application
        npm run build
        
        print_status "Application build completed"
    else
        print_warning "Application build skipped"
    fi
}

# Setup WebSocket server
setup_websocket() {
    echo -e "${BLUE}🔌 Setting up WebSocket server...${NC}"
    
    # Create systemd service for WebSocket server (Linux)
    if command -v systemctl &> /dev/null; then
        cat > /tmp/omnipreneur-websocket.service << EOF
[Unit]
Description=Omnipreneur WebSocket Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
Environment=WS_PORT=3001
ExecStart=/usr/bin/node server/websocket-server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

        if [[ "$EUID" -eq 0 ]]; then
            cp /tmp/omnipreneur-websocket.service /etc/systemd/system/
            systemctl daemon-reload
            systemctl enable omnipreneur-websocket
            print_status "WebSocket service configured"
        else
            print_warning "Run as root to configure WebSocket service"
        fi
    fi
}

# Setup SSL certificates (using Let's Encrypt)
setup_ssl() {
    if command -v certbot &> /dev/null && [[ "$ENVIRONMENT" == "production" ]]; then
        echo -e "${BLUE}🔒 Setting up SSL certificates...${NC}"
        
        # Check if certificate already exists
        if [[ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
            echo "Obtaining SSL certificate for ${DOMAIN}..."
            certbot certonly --nginx -d "${DOMAIN}" --non-interactive --agree-tos --email "admin@${DOMAIN}"
            print_status "SSL certificate obtained"
        else
            print_status "SSL certificate already exists"
        fi
    else
        print_warning "SSL setup skipped (certbot not available or not production)"
    fi
}

# Configure nginx
setup_nginx() {
    if command -v nginx &> /dev/null && [[ "$ENVIRONMENT" == "production" ]]; then
        echo -e "${BLUE}🌐 Configuring nginx...${NC}"
        
        # Create nginx configuration
        cat > /tmp/omnipreneur-nginx.conf << EOF
upstream nextjs {
    server 127.0.0.1:3000;
}

upstream websocket {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket proxy
    location /ws {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://nextjs;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

        if [[ "$EUID" -eq 0 ]]; then
            cp /tmp/omnipreneur-nginx.conf "/etc/nginx/sites-available/${DOMAIN}"
            ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
            nginx -t && systemctl reload nginx
            print_status "Nginx configured"
        else
            print_warning "Run as root to configure nginx"
        fi
    else
        print_warning "Nginx configuration skipped"
    fi
}

# Setup monitoring
setup_monitoring() {
    echo -e "${BLUE}📊 Setting up monitoring...${NC}"
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'omnipreneur-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      error_file: 'logs/app-error.log',
      out_file: 'logs/app-out.log',
      log_file: 'logs/app-combined.log'
    },
    {
      name: 'omnipreneur-websocket',
      script: 'server/websocket-server.js',
      env: {
        NODE_ENV: 'production',
        WS_PORT: 3001
      },
      instances: 1,
      max_memory_restart: '512M',
      error_file: 'logs/ws-error.log',
      out_file: 'logs/ws-out.log',
      log_file: 'logs/ws-combined.log'
    }
  ]
};
EOF

    # Create logs directory
    mkdir -p logs
    
    print_status "Monitoring configuration created"
}

# Start services
start_services() {
    echo -e "${BLUE}🎬 Starting services...${NC}"
    
    if command -v pm2 &> /dev/null; then
        echo "Starting with PM2..."
        pm2 start ecosystem.config.js
        pm2 save
        pm2 startup
        print_status "Services started with PM2"
    elif command -v systemctl &> /dev/null; then
        echo "Starting with systemd..."
        systemctl start omnipreneur-websocket
        print_status "WebSocket service started"
        print_warning "Start your Next.js app manually or configure systemd service"
    else
        print_warning "No process manager found. Start services manually:"
        echo "  npm start"
        echo "  node server/websocket-server.js"
    fi
}

# Health check
health_check() {
    echo -e "${BLUE}🏥 Running health check...${NC}"
    
    # Wait for services to start
    sleep 5
    
    # Check main application
    if curl -f "http://localhost:3000/api/health" &> /dev/null; then
        print_status "Main application is healthy"
    else
        print_error "Main application health check failed"
    fi
    
    # Check WebSocket server
    if curl -f "http://localhost:3001" &> /dev/null; then
        print_status "WebSocket server is running"
    else
        print_warning "WebSocket server health check failed"
    fi
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting deployment at $(date)${NC}"
    
    check_environment
    install_dependencies
    run_tests
    setup_database
    build_application
    setup_websocket
    setup_ssl
    setup_nginx
    setup_monitoring
    start_services
    health_check
    
    echo
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}🌐 Your application should be available at: https://${DOMAIN}${NC}"
    echo
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "${YELLOW}1. Test your application thoroughly${NC}"
    echo -e "${YELLOW}2. Set up monitoring and alerts${NC}"
    echo -e "${YELLOW}3. Configure backups${NC}"
    echo -e "${YELLOW}4. Review security settings${NC}"
    echo
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "test")
        RUN_TESTS=true
        DB_MIGRATE=false
        BUILD_STATIC=false
        run_tests
        ;;
    "build")
        BUILD_STATIC=true
        build_application
        ;;
    "health")
        health_check
        ;;
    *)
        echo "Usage: $0 [deploy|test|build|health]"
        exit 1
        ;;
esac