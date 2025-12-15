# 📦 How to Deploy to AWS - Complete Guide

Your Wedding Invite platform is **fully configured and ready** for AWS deployment! This document explains everything you need to know.

---

## 🎯 Your App Structure

```
wedding_invite/
├── client/              # React frontend (Vite)
├── server/              # Express backend
├── shared/              # Shared types/schema
├── .ebextensions/       # AWS Elastic Beanstalk config (NEW)
├── .github/workflows/   # GitHub Actions CI/CD (NEW)
├── package.json         # Build: vite + esbuild
└── vite.config.ts       # Serves frontend + backend as one
```

**Key Point**: Your app builds into a **single `dist/` folder** containing:
- `dist/public/` - React app (static)
- `dist/index.js` - Express server (bundles everything)

---

## 🚀 Deployment Options

### **1. Elastic Beanstalk (RECOMMENDED) ⭐**

**Best for**: Production, auto-scaling, managed infrastructure

**Setup time**: 15 minutes  
**Cost**: $15-30/month  
**Steps**:
1. Install EB CLI
2. Run: `eb init` → `eb create` → `eb deploy`
3. Done! AWS manages everything else

**Includes**:
- Auto-scaling (grows with traffic)
- Load balancing
- Auto health checks
- CloudWatch logging
- Easy rollbacks

**This is what `.ebextensions/` config is for.**

---

### **2. EC2 + PM2 (Full Control)**

**Best for**: Developers who want maximum control

**Setup time**: 30 minutes  
**Cost**: $5-10/month  
**Steps**:
1. Launch EC2 instance (Ubuntu)
2. SSH in and clone repo
3. Install Node.js, PM2, Nginx
4. Run: `npm run build && pm2 start dist/index.js`
5. Configure Nginx reverse proxy

---

### **3. GitHub Actions (CI/CD)**

**Best for**: Automatic deployment on every push

**Setup time**: 10 minutes (on top of EB/EC2)  
**Steps**:
1. Add GitHub secrets (AWS credentials)
2. Push to `main` branch
3. GitHub Actions auto-builds and deploys
4. No manual `eb deploy` needed

**This is what `.github/workflows/deploy.yml` is for.**

---

## 📚 Documentation You Have

| File | Purpose |
|------|---------|
| **QUICK_START_DEPLOYMENT.md** | **Read this first** - 15-minute fast path |
| **DEPLOYMENT_CHECKLIST.md** | Phase-by-phase checklist (copy & paste) |
| **AWS_DEPLOYMENT_GUIDE.md** | Complete detailed guide for all 3 options |
| **.ebextensions/** | AWS config files (ready to use) |
| **.github/workflows/deploy.yml** | GitHub Actions CI/CD (ready to use) |
| **deploy.sh** | Helper script for manual deployment |

---

## ⚡ Fastest Path to Production (15 min)

### 1. Prerequisites (5 min)
```powershell
# Install AWS CLI and EB CLI
pip install awscli awsebcli

# Configure AWS
aws configure
# Enter your AWS Access Key ID and Secret Access Key
```

### 2. Initialize EB in Your Project (2 min)
```powershell
cd D:\WeddingInvite.ai\Web\WedInvitesSEO

eb init -p "Node.js 20 running on 64bit Amazon Linux 2" wedding-invite --region ap-south-1
```

### 3. Create RDS Database (3 min)
Go to **AWS RDS Dashboard** → Create Database:
- **Engine**: PostgreSQL
- **Name**: `wedding-invites-db`
- **Master User**: `postgres`
- **Password**: Save securely
- **Public Access**: No

### 4. Create S3 Bucket (2 min)
```powershell
aws s3api create-bucket `
  --bucket wedding-invite-bucket `
  --region ap-south-1 `
  --create-bucket-configuration LocationConstraint=ap-south-1
```

### 5. Create EB Environment (2 min)
```powershell
eb create wedding-invite-prod --instance-type t3.small
```

### 6. Set Environment Variables (1 min)
```powershell
eb setenv `
  NODE_ENV=production `
  DATABASE_URL="postgresql://postgres:PASSWORD@rds-endpoint:5432/weddings" `
  DATABASE_SSL_ENABLED=true `
  AWS_S3_BUCKET=wedding-invite-bucket `
  AWS_ACCESS_KEY_ID=YOUR_KEY `
  AWS_SECRET_ACCESS_KEY=YOUR_SECRET
```

### 7. Deploy (2 min)
```powershell
eb deploy
```

### 8. View Your App
```powershell
eb open  # Opens in browser
```

✅ **Done! Your app is live.**

---

## 🔑 Required AWS Credentials & Secrets

You need to set these on EB:

```
NODE_ENV=production
PORT=8081
DATABASE_URL=postgresql://postgres:PASSWORD@rds-endpoint:5432/weddings
DATABASE_SSL_ENABLED=true
AWS_REGION=ap-south-1
AWS_S3_BUCKET=wedding-invite-bucket
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BASE_URL=https://wedding-invite-bucket.s3.ap-south-1.amazonaws.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
SESSION_SECRET=your-random-secret-string
```

**How to set them**:
```powershell
# Via CLI (easiest)
eb setenv KEY1=value1 KEY2=value2 ...

# Or via AWS Console:
# Elastic Beanstalk → Environment → Configuration → Environment properties
```

---

## 🏗️ What Happens During Deployment

When you run `eb deploy`:

1. **Build phase** (happens on EB instance):
   ```bash
   npm ci --production    # Install deps
   npm run build          # Build React + Express
   npm run db:push        # Run migrations
   ```

2. **Start phase**:
   ```bash
   node dist/index.js     # Start Express server
   ```

3. **Serve phase**:
   - Nginx listens on port 80/443
   - Routes static files from `dist/public/`
   - Routes API calls to Express on port 8081
   - Express serves both React frontend + API

---

## 📊 Architecture After Deployment

```
Users (Browser/Mobile)
    ↓
    ↓ HTTPS (443)
    ↓
AWS ELB (Load Balancer)
    ↓
    ↓ HTTP (8081)
    ↓
EC2 Instance(s)
    ├── Nginx (reverse proxy)
    ├── Node.js/Express server
    │   ├── React frontend (dist/public)
    │   ├── API routes (/api/...)
    │   └── Auth, payments, etc.
    └── Database connection pool
         ↓
AWS RDS (PostgreSQL)
    ↓
Stored data (templates, projects, users)

Separate systems:
├── AWS S3 (file storage - photos, music, videos)
├── Firebase (authentication)
└── Razorpay (payment processing)
```

---

## ✅ Pre-Deployment Checklist

Before you deploy, verify:

- [ ] `npm run build` succeeds locally
- [ ] `.env` is in `.gitignore` (it is ✓)
- [ ] All code pushed to GitHub
- [ ] AWS account created and credentials configured
- [ ] `.ebextensions/` folder exists in repo
- [ ] `.github/workflows/deploy.yml` exists in repo

---

## 🆘 Troubleshooting

### "Build fails"
```powershell
# Test locally first
npm run build
# If it fails locally, fix it before deploying
```

### "Deployment timeout"
```powershell
# Check logs
eb logs --all

# Common: DB not set or unreachable
# Solution: Verify DATABASE_URL is set correctly
```

### "App shows 500 error"
```powershell
# SSH into instance
eb ssh

# Check logs
tail -f /var/log/nodejs/nodejs.log

# Run migrations (might be missing)
npm run db:push

# Check environment variables
env | grep DATABASE
```

### "Static files not loading (CSS/JS)"
```powershell
# Verify build completed
npm run build
ls -la dist/public/

# If empty: check Vite config output directory
# Then redeploy: eb deploy
```

### "Database migrations didn't run"
```powershell
eb ssh
npm run db:push
npm run seed  # Optional: add sample data
```

---

## 📈 Monitoring & Maintenance

### View Logs
```powershell
eb logs --all      # All logs
eb logs --stream   # Real-time logs
```

### Monitor Performance
Go to **AWS CloudWatch** → Dashboards → Your EB environment
- See CPU, memory, request count
- Set up alarms for high error rates

### Auto-Scaling
```powershell
# Configure in AWS Console:
# EB → Configuration → Capacity
# Set minimum and maximum instances
```

### Backups
Go to **RDS** → Databases → Modify:
- Set **Backup retention** to 7-30 days
- AWS auto-backs up your database

---

## 💰 Cost Breakdown (Monthly)

| Service | Cost |
|---------|------|
| Elastic Beanstalk (t3.small) | $15-20 |
| RDS (db.t3.micro, free tier) | $0-50 |
| S3 (1GB storage, uploads) | $0.02-1 |
| Data transfer | $0-5 |
| **Total** | **~$20-70/month** |

**Ways to save**:
- Use free tier (first 12 months)
- Use t3.micro for low traffic
- Delete unused resources
- Set up CloudWatch alarms to monitor

---

## 🔄 Continuous Deployment (Optional)

After first successful deploy, you can auto-deploy on every push:

1. Go to **GitHub** → Your repo → Settings → Secrets
2. Add secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

3. GitHub Actions will now auto-deploy when you push to `main`
   - See workflow: `.github/workflows/deploy.yml`
   - No manual `eb deploy` needed anymore!

---

## 🎓 Next Steps

1. **Read**: `QUICK_START_DEPLOYMENT.md` (5 minutes)
2. **Follow**: "Fastest Path" section above (15 minutes)
3. **Deploy**: `eb deploy` (automated)
4. **Test**: `eb open` and verify functionality
5. **Monitor**: Check CloudWatch logs

---

## 📞 Support & Resources

- **AWS EB Docs**: https://docs.aws.amazon.com/elasticbeanstalk/
- **Node.js on AWS**: https://aws.amazon.com/nodejs/
- **RDS Docs**: https://docs.aws.amazon.com/rds/
- **S3 Docs**: https://docs.aws.amazon.com/s3/
- **Your logs**: `eb logs --all`

---

## 🎉 You're Ready!

Your app is fully configured for production deployment. Choose your path:

- **Want automatic?** → Deploy to Elastic Beanstalk
- **Want control?** → Deploy to EC2
- **Want automation?** → Setup GitHub Actions (auto-deploy on push)

**Questions?** Check the detailed guides:
- `QUICK_START_DEPLOYMENT.md` - Fast path (15 min)
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `AWS_DEPLOYMENT_GUIDE.md` - All details and options

**Let's deploy! 🚀**
