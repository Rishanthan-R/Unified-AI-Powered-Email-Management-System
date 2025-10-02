# Deployment Guide

## Prerequisites

- Domain name with DNS configured
- SSL/TLS certificate
- Server with Docker and Docker Compose installed
- PostgreSQL database (can use Docker)
- OpenAI API key

## Production Environment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Create application directory
sudo mkdir -p /opt/unified-email-manager
cd /opt/unified-email-manager
```

### 2. Clone Repository

```bash
git clone https://github.com/your-username/Unified-AI-Powered-Email-Management-System.git
cd Unified-AI-Powered-Email-Management-System
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
nano .env
```

Configure the following variables:

```env
# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_strong_random_secret

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key

# Gmail OAuth2 (if using)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REDIRECT_URI=https://yourdomain.com/api/auth/gmail/callback

# Outlook OAuth2 (if using)
OUTLOOK_CLIENT_ID=your-outlook-client-id
OUTLOOK_CLIENT_SECRET=your-outlook-client-secret
OUTLOOK_REDIRECT_URI=https://yourdomain.com/api/auth/outlook/callback
```

### 4. Update Docker Compose for Production

Edit `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: unified-email-db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: unified-email-backend
    environment:
      NODE_ENV: production
      PORT: 5000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      GMAIL_CLIENT_ID: ${GMAIL_CLIENT_ID}
      GMAIL_CLIENT_SECRET: ${GMAIL_CLIENT_SECRET}
      GMAIL_REDIRECT_URI: ${GMAIL_REDIRECT_URI}
      OUTLOOK_CLIENT_ID: ${OUTLOOK_CLIENT_ID}
      OUTLOOK_CLIENT_SECRET: ${OUTLOOK_CLIENT_SECRET}
      OUTLOOK_REDIRECT_URI: ${OUTLOOK_REDIRECT_URI}
      FRONTEND_URL: https://yourdomain.com
    depends_on:
      - postgres
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: https://yourdomain.com/api
    container_name: unified-email-frontend
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: unified-email-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### 5. Configure Nginx with SSL

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    upstream frontend {
        server frontend:80;
    }

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        client_max_body_size 10M;

        location /api {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 6. Obtain SSL Certificate

Using Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot -y

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/
sudo chmod 600 ./ssl/*.pem
```

### 7. Build and Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Verify services are running
docker-compose ps
```

### 8. Database Initialization

```bash
# Run database migrations
docker-compose exec backend npm run db:sync
```

### 9. Configure OAuth2 Callbacks

Update your OAuth2 applications:

**Gmail:**
- Authorized redirect URIs: `https://yourdomain.com/api/auth/gmail/callback`

**Outlook:**
- Redirect URIs: `https://yourdomain.com/api/auth/outlook/callback`

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres unified_email_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T postgres psql -U postgres unified_email_db < backup.sql
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Remove unused images
docker image prune -a
```

### SSL Certificate Renewal

```bash
# Renew certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/

# Restart nginx
docker-compose restart nginx
```

## Performance Optimization

### Enable Redis Caching (Optional)

Add Redis to `docker-compose.yml`:

```yaml
  redis:
    image: redis:alpine
    container_name: unified-email-redis
    restart: unless-stopped
    networks:
      - app-network
```

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_emails_received_date ON emails (received_date DESC);
CREATE INDEX idx_emails_is_read ON emails (is_read);
CREATE INDEX idx_emails_priority ON emails (ai_priority);
```

## Security Checklist

- [ ] Environment variables are properly secured
- [ ] SSL/TLS is configured and working
- [ ] Database credentials are strong
- [ ] JWT secret is randomly generated
- [ ] OAuth2 credentials are kept secure
- [ ] Firewall is configured (only ports 80, 443 open)
- [ ] Regular backups are scheduled
- [ ] Log rotation is configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured

## Troubleshooting

### Services won't start

```bash
# Check Docker logs
docker-compose logs

# Check Docker service status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker
```

### Database connection errors

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check database credentials
docker-compose exec postgres psql -U postgres -c "\l"

# Restart database
docker-compose restart postgres
```

### SSL certificate issues

```bash
# Check certificate validity
openssl x509 -in ./ssl/fullchain.pem -noout -dates

# Test SSL configuration
curl -I https://yourdomain.com
```

## Scaling Considerations

For high-traffic deployments:

1. **Load Balancing**: Use multiple backend instances behind a load balancer
2. **Database Replication**: Set up PostgreSQL read replicas
3. **CDN**: Use a CDN for frontend static assets
4. **Caching**: Implement Redis for session and data caching
5. **Message Queue**: Use RabbitMQ or Redis for email sync jobs
6. **Monitoring**: Set up Prometheus and Grafana for metrics

## Support

For deployment issues:
- Check logs first: `docker-compose logs -f`
- Verify environment variables
- Ensure all services are running: `docker-compose ps`
- Review the troubleshooting section

## Production Checklist

Before going live:

- [ ] All environment variables are configured
- [ ] SSL certificates are installed and valid
- [ ] Database is properly initialized
- [ ] OAuth2 callbacks are configured correctly
- [ ] Backups are scheduled
- [ ] Monitoring is set up
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Application is tested end-to-end
- [ ] Documentation is updated
