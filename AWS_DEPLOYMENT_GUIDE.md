# AWS Deployment Guide - Wedding Invite Platform

Your app has **both frontend (React/Vite) and backend (Express) in one repository**. Here's the best way to deploy it.

---

## 📊 Deployment Options Comparison

| Option | Best For | Cost | Setup Time | Scaling |
|--------|----------|------|-----------|---------|
| **Elastic Beanstalk** ⭐ | Production, simple scaling | Low ($5-50/mo) | 15 min | Auto-scaling |
| **EC2 + PM2** | Full control | Low-Medium | 30 min | Manual |
| **Lambda (serverless)** | Low traffic | Pay-per-use | Complex | Perfect |

**Recommended: Elastic Beanstalk** (easiest for your setup)

---

## Option 1: Deploy to AWS Elastic Beanstalk (Recommended) ⭐

### Prerequisites
- AWS Account
- AWS CLI installed (`pip install awscli` or download from AWS)
- Elastic Beanstalk CLI (`pip install awsebcli`)
- Your code pushed to GitHub

### Step 1: Install EB CLI

```powershell
pip install awsebcli --upgrade --user
# Add to PATH if needed
```

### Step 2: Initialize Elastic Beanstalk in Your Project

```powershell
cd D:\WeddingInvite.ai\Web\WedInvitesSEO
eb init -p "Node.js 20 running on 64bit Amazon Linux 2" wedding-invite --region ap-south-1
```

When prompted:
- **Use code commit?** → No (you're using GitHub)
- **Set up SSH?** → Yes (for EC2 access)

### Step 3: Create `.ebextensions` Directory

Create the folder structure for AWS configuration:

```powershell
mkdir .ebextensions
```

### Step 4: Configure Environment Variables (`.ebextensions/env.config`)

Create file: `.ebextensions/env.config`

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8081
    # Database (use AWS RDS endpoint)
    DATABASE_URL: "postgresql://user:password@your-rds-endpoint:5432/weddings"
    DATABASE_SSL_ENABLED: "true"
    # AWS S3
    AWS_REGION: "ap-south-1"
    AWS_S3_BUCKET: "wedding-invite-bucket"
    AWS_S3_BASE_URL: "https://wedding-invite-bucket.s3.ap-south-1.amazonaws.com"
    # Firebase (base64 encoded service account JSON)
    FIREBASE_SERVICE_ACCOUNT: "${FIREBASE_SERVICE_ACCOUNT}"
    # Razorpay
    RAZORPAY_KEY_ID: "${RAZORPAY_KEY_ID}"
    RAZORPAY_KEY_SECRET: "${RAZORPAY_KEY_SECRET}"
    # Session Secret
    SESSION_SECRET: "${SESSION_SECRET}"
```

### Step 5: Configure Build Steps (`.ebextensions/nodecommand.config`)

Create file: `.ebextensions/nodecommand.config`

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node dist/index.js"
  
files:
  "/opt/elasticbeanstalk/tasks/bundlelogs.d/01_node.conf":
    content: |
      /var/log/nodejs/nodejs.log
```

### Step 6: Add Deployment Hooks (`.ebextensions/deploy.config`)

Create file: `.ebextensions/deploy.config`

```yaml
container_commands:
  01_npm_install:
    command: "npm ci --production"
    leader_only: true
  02_build:
    command: "npm run build"
    leader_only: true
  03_db_migrate:
    command: "npm run db:push"
    leader_only: true
    ignoreErrors: true
option_settings:
  aws:autoscaling:launchconfiguration:
    IamInstanceProfile: aws-elasticbeanstalk-ec2-role
```

### Step 7: Create `.platform` Directory for Nginx Config

Create: `.platform/nginx/conf.d/elasticbeanstalk/01_proxy.conf`

```nginx
# Rewrite static assets to serve from dist/public
client_max_body_size 15M;
```

### Step 8: Create Environment on AWS

```powershell
# Create the EB environment
eb create wedding-invite-prod --instance-type t3.small --scale 1 --envvars DATABASE_URL="postgresql://...",AWS_ACCESS_KEY_ID="...",AWS_SECRET_ACCESS_KEY="..."

# Or create via AWS Console (easier for first time):
# 1. Go to Elastic Beanstalk Dashboard
# 2. Click "Create application"
# 3. Name: "wedding-invite"
# 4. Environment: "wedding-invite-prod"
# 5. Platform: "Node.js 20 running on 64bit Amazon Linux 2"
# 6. Upload ZIP of your code (with .ebextensions folder)
```

### Step 9: Set Environment Variables via AWS Console or CLI

```powershell
eb setenv \
  DATABASE_URL="postgresql://user:pass@rds-endpoint:5432/weddings" \
  AWS_ACCESS_KEY_ID="AKIA..." \
  AWS_SECRET_ACCESS_KEY="..." \
  FIREBASE_SERVICE_ACCOUNT="..." \
  RAZORPAY_KEY_ID="..." \
  RAZORPAY_KEY_SECRET="..." \
  SESSION_SECRET="..."

# View deployed app
eb open
```

### Step 10: Monitor Deployment

```powershell
# View logs
eb logs

# SSH into instance
eb ssh

# Check status
eb status
```

---

## Option 2: Deploy to EC2 + PM2

### Quick Setup

```powershell
# 1. Launch EC2 (t3.small, Ubuntu 22.04, allow ports 80, 443, 5000)

# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. On the instance:
sudo apt update && sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql-client

# 4. Clone your repo
git clone https://github.com/your-username/wedding-invite.git
cd wedding-invite

# 5. Install dependencies
npm ci --production

# 6. Build
npm run build

# 7. Install PM2 globally
sudo npm install -g pm2

# 8. Start app with PM2
pm2 start dist/index.js --name "wedding-invite"
pm2 startup
pm2 save

# 9. Setup reverse proxy with Nginx
sudo apt install -y nginx
# Edit: sudo nano /etc/nginx/sites-available/default
# Add upstream and proxy config (see section below)

# 10. Enable HTTPS with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly -d your-domain.com -d www.your-domain.com
```

**Nginx Config** (`/etc/nginx/sites-available/default`):

```nginx
upstream nodejs_backend {
    server localhost:8081;
}

server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    client_max_body_size 15M;
    
    location / {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Option 3: Deploy via GitHub Actions to AWS (CI/CD)

Create: `.github/workflows/deploy.yml`

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci --production
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v21
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: wedding-invite
          environment_name: wedding-invite-prod
          region: ap-south-1
          version_label: v${{ github.run_number }}
          deployment_package: deploy.zip
          use_existing_version_if_available: false
```

---

## 🗄️ Database Setup (AWS RDS)

### Create PostgreSQL RDS Instance

1. **Go to RDS Dashboard** → Create Database
2. **Engine**: PostgreSQL 15
3. **Template**: Free tier (for testing)
4. **DB Instance**: `wedding-invites-db`
5. **Master username**: `postgres`
6. **Master password**: Strong password
7. **Security Group**: Allow inbound on port 5432 from your EB security group
8. **Publicly accessible**: No (unless you need it)

### Get Connection String

```
postgresql://postgres:password@your-rds-endpoint.amazonaws.com:5432/weddings
```

### Run Migrations

```powershell
# After deployment
eb ssh
npm run db:push
npm run seed  # Optional: seed with sample data
```

---

## 🪣 S3 Bucket Setup

### Create S3 Bucket

```powershell
aws s3api create-bucket \
  --bucket wedding-invite-bucket \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# Enable CORS
aws s3api put-bucket-cors \
  --bucket wedding-invite-bucket \
  --cors-configuration file://cors.json  # See below
```

### Create `cors.json`

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-domain.com"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### Create IAM User for S3 Access

1. **IAM Dashboard** → Users → Create user
2. **Username**: `wedding-invite-app`
3. **Attach policy**: `AmazonS3FullAccess`
4. **Create access key** (Copy `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`)

---

## 🔐 Environment Variables

Create `.env.production` (don't commit, set via EB Console):

```env
NODE_ENV=production
PORT=8081
DATABASE_URL=postgresql://postgres:password@rds-endpoint:5432/weddings
DATABASE_SSL_ENABLED=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
AWS_REGION=ap-south-1
AWS_S3_BUCKET=wedding-invite-bucket
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BASE_URL=https://wedding-invite-bucket.s3.ap-south-1.amazonaws.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
SESSION_SECRET=your-secure-random-string
```

---

## ✅ Pre-Deployment Checklist

- [ ] `.env` is in `.gitignore` (✓ already is)
- [ ] `.env.example` has placeholders (✓ already is)
- [ ] `npm run build` succeeds locally
- [ ] Git is clean: `git status` shows nothing
- [ ] All code pushed to GitHub
- [ ] AWS credentials configured: `aws configure`
- [ ] RDS database created and accessible
- [ ] S3 bucket created with CORS enabled
- [ ] IAM user created with S3 access
- [ ] Environment variables set in AWS

---

## 🚀 Quick Deploy Steps (Elastic Beanstalk)

```powershell
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize (first time only)
eb init -p "Node.js 20 running on 64bit Amazon Linux 2" wedding-invite --region ap-south-1

# 3. Create environment
eb create wedding-invite-prod --instance-type t3.small

# 4. Set environment variables
eb setenv NODE_ENV=production DATABASE_URL="..." AWS_ACCESS_KEY_ID="..." ...

# 5. Deploy (whenever you push to main)
git push origin main
eb deploy

# 6. Monitor
eb logs --all
eb open  # Opens app in browser
```

---

## 📊 Cost Estimate (Monthly)

- **Elastic Beanstalk** (t3.small): ~$15-20
- **RDS** (db.t3.micro, free tier eligible): ~$0-50
- **S3** (1GB storage): ~$0.02
- **Data transfer**: ~$0-5
- **Total**: ~$20-70/month for production

---

## 🔧 Troubleshooting

### Deployment Fails
```powershell
eb logs --all  # View all logs
eb ssh         # SSH into instance for debugging
pm2 logs       # Check PM2 logs (if using EC2)
```

### App Won't Start
```powershell
# Check if build succeeded
npm run build

# Check if environment variables are set
eb printenv

# Verify database connection
eb ssh
# Then: npm run db:push (verify migration)
```

### Static Files Not Loading
- Ensure `dist/public` exists: `npm run build`
- Check Vite output directory in `vite.config.ts`
- Verify Nginx proxy config serves static files correctly

---

## 📚 Additional Resources

- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Vite Deployment Guide](https://vitejs.dev/guide/ssr.html)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js on AWS](https://aws.amazon.com/nodejs/)

---

**Questions?** Check the `.ebextensions` files or AWS EB logs with `eb logs --all`.
