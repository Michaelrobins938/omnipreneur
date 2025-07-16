# 🚀 Omnipreneur Deployment Guide

Complete deployment guide for the Omnipreneur Premium UI System.

## 📋 Prerequisites

Before deploying, ensure you have:

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) database
- [Redis](https://redis.io/) for caching
- [Stripe](https://stripe.com/) account for payments
- [OpenAI](https://openai.com/) API key
- [Anthropic](https://anthropic.com/) API key
- Email service (Gmail, SendGrid, etc.)

## 🏗️ Production Environment Setup

### 1. Database Setup

#### PostgreSQL (Recommended)
```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Create database
sudo -u postgres createdb omnipreneur
sudo -u postgres createuser omnipreneur_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE omnipreneur TO omnipreneur_user;"
```

#### Alternative: Supabase (Cloud)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Update `DATABASE_URL` in environment variables

### 2. Redis Setup

#### Local Redis
```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis

# Start Redis
sudo systemctl start redis-server
```

#### Alternative: Upstash (Cloud)
1. Create account at [upstash.com](https://upstash.com)
2. Create Redis database
3. Get connection string
4. Update `REDIS_URL` in environment variables

### 3. Environment Variables

Create `.env.production` with all required variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/omnipreneur"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# AI APIs
OPENAI_API_KEY="sk-your-openai-api-key"
CLAUDE_API_KEY="sk-ant-your-claude-api-key"

# Payment Processing
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourdomain.com"

# Application
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NODE_ENV="production"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
SENTRY_DSN="your-sentry-dsn"
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Production ready"
git push origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Create account and connect GitHub
3. Import your repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### Step 3: Environment Variables
In Vercel dashboard, add all environment variables from `.env.production`

#### Step 4: Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy
3. Set up custom domain in Settings > Domains

#### Step 5: Database Migration
```bash
# Connect to Vercel via CLI
npx vercel link

# Run database migrations
npx vercel env pull .env.production
npx prisma db push
```

### Option 2: DigitalOcean App Platform

#### Step 1: Prepare Application
```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

# Create .dockerignore
cat > .dockerignore << EOF
node_modules
.next
.git
.env*
npm-debug.log*
README.md
EOF
```

#### Step 2: Deploy to DigitalOcean
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app
3. Connect GitHub repository
4. Configure build settings
5. Add environment variables
6. Deploy

### Option 3: AWS EC2

#### Step 1: Launch EC2 Instance
```bash
# Launch Ubuntu 22.04 LTS instance
# Security Group: Allow ports 22, 80, 443, 3000
```

#### Step 2: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
```

#### Step 3: Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd omnipreneur-premium-ui

# Install dependencies
npm install

# Build application
npm run build

# Set environment variables
cp .env.production .env

# Start with PM2
pm2 start npm --name "omnipreneur" -- start
pm2 startup
pm2 save
```

#### Step 4: Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/omnipreneur

# Add configuration
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/omnipreneur /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 4: Docker Compose

#### Step 1: Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://omnipreneur:password@db:5432/omnipreneur
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=production
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=omnipreneur
      - POSTGRES_USER=omnipreneur
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Step 2: Deploy
```bash
# Build and start services
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma db push
```

## 🔧 Post-Deployment Setup

### 1. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 2. Stripe Webhook Setup
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 3. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Monitoring Setup

#### Sentry (Error Tracking)
1. Create account at [sentry.io](https://sentry.io)
2. Create new project
3. Add DSN to environment variables
4. Install Sentry SDK:
```bash
npm install @sentry/nextjs
```

#### Google Analytics
1. Create Google Analytics account
2. Add tracking ID to environment variables
3. Configure in `pages/_app.tsx`

## 🔍 Health Checks

### Application Health
```bash
# Check if app is running
curl http://localhost:3000/api/health

# Check database connection
npx prisma db execute --stdin <<< "SELECT 1;"

# Check Redis connection
redis-cli ping
```

### Monitoring Commands
```bash
# View logs
pm2 logs omnipreneur

# Monitor resources
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check PostgreSQL status
sudo systemctl status postgresql
```

## 🔒 Security Checklist

- [ ] Environment variables are set
- [ ] JWT secret is strong and unique
- [ ] Database passwords are secure
- [ ] SSL certificate is installed
- [ ] Firewall rules are configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive data

## 📊 Performance Optimization

### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### Caching Strategy
```javascript
// Redis caching for API responses
const cacheKey = `api:${endpoint}:${JSON.stringify(params)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

### CDN Setup
1. Configure Cloudflare or similar CDN
2. Cache static assets
3. Enable compression
4. Set up edge locations

## 🚨 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U omnipreneur -d omnipreneur
```

#### Redis Connection
```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping
```

#### Application Crashes
```bash
# Check PM2 logs
pm2 logs omnipreneur

# Restart application
pm2 restart omnipreneur
```

#### Nginx Issues
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (HAProxy, Nginx)
- Deploy multiple application instances
- Use Redis cluster for session storage
- Implement database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching strategies
- Use CDN for static assets

## 🔄 Backup Strategy

### Database Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump omnipreneur > backup_$DATE.sql
gzip backup_$DATE.sql
```

### File Backup
```bash
# Backup uploads and configs
tar -czf backup_$(date +%Y%m%d).tar.gz uploads/ config/
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

---

**For additional support, contact: support@omnipreneur.com** 