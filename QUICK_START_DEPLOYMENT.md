# 🚀 AWS Deployment - Quick Start Guide

Your Wedding Invite app is ready to deploy to AWS! Here's the fastest path:

---

## 1️⃣ Choose Your Deployment Method

### **Option 1: Elastic Beanstalk (Recommended - Easiest)**
- ✅ Auto-scaling
- ✅ Load balancing
- ✅ Easy rollbacks
- ⏱️ 20 minutes to deploy
- 💰 $15-30/month

### **Option 2: EC2 + PM2 (Full Control)**
- ✅ Maximum control
- ✅ Lowest cost ($5-10/month for t3.micro)
- ⚠️ More manual maintenance
- ⏱️ 30 minutes to deploy

### **Option 3: GitHub Actions (CI/CD Automation)**
- ✅ Auto-deploy on every push to main
- ✅ No manual steps after first setup
- ⚠️ Requires Elastic Beanstalk or EC2
- ⏱️ 10 minutes to setup

---

## 🎯 Fastest Path (15 minutes)

### Step 1: Install Prerequisites (5 min)
```powershell
# Install AWS CLI
pip install awscli

# Install Elastic Beanstalk CLI
pip install awsebcli

# Configure AWS credentials
aws configure
# Enter:
# - Access Key ID: [from AWS IAM]
# - Secret Access Key: [from AWS IAM]
# - Default region: ap-south-1
# - Output: json
```

### Step 2: Initialize Elastic Beanstalk (2 min)
```powershell
cd D:\WeddingInvite.ai\Web\WedInvitesSEO

eb init -p "Node.js 20 running on 64bit Amazon Linux 2" wedding-invite --region ap-south-1
```

When prompted:
- **Use CodeCommit?** → No
- **Set up SSH?** → Yes

### Step 3: Create Database on RDS (3 min)
1. Go to **AWS RDS Dashboard**
2. Create Database → PostgreSQL (free tier)
3. Name: `wedding-invites-db`
4. Username: `postgres`
5. Save password & endpoint

### Step 4: Create S3 Bucket (2 min)
```powershell
aws s3api create-bucket `
  --bucket wedding-invite-bucket `
  --region ap-south-1 `
  --create-bucket-configuration LocationConstraint=ap-south-1
```

### Step 5: Create EB Environment (2 min)
```powershell
eb create wedding-invite-prod --instance-type t3.small
```

### Step 6: Set Environment Variables (1 min)
```powershell
eb setenv `
  NODE_ENV=production `
  DATABASE_URL="postgresql://postgres:PASSWORD@rds-endpoint:5432/weddings" `
  DATABASE_SSL_ENABLED=true `
  AWS_S3_BUCKET=wedding-invite-bucket `
  AWS_ACCESS_KEY_ID=YOUR_KEY `
  AWS_SECRET_ACCESS_KEY=YOUR_SECRET
```

### Step 7: Deploy (2 min)
```powershell
eb deploy
```

### Step 8: Monitor (auto)
```powershell
eb open  # Opens app in browser
```

✅ **Done!** Your app is live in ~15 minutes.

---

## 📚 Complete Documentation

For detailed setup, see:
- **`AWS_DEPLOYMENT_GUIDE.md`** - All 3 deployment options with full steps
- **`DEPLOYMENT_CHECKLIST.md`** - Phase-by-phase checklist (copy & paste)
- **`.ebextensions/`** - Auto-generated config files for EB

---

## 💰 Costs (Monthly Estimate)

| Component | Cost |
|-----------|------|
| Elastic Beanstalk (t3.small) | $15-20 |
| RDS (db.t3.micro, free tier eligible) | $0-50 |
| S3 (1GB storage) | $0.02 |
| Data transfer | $0-5 |
| **Total** | **~$20-70/month** |

---

## 🔄 Continuous Deployment (Optional)

After first deploy, you can auto-deploy on every GitHub push:

1. Add GitHub secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

2. GitHub Actions will auto-deploy on push to `main`
   - Workflow: `.github/workflows/deploy.yml`
   - No manual `eb deploy` needed

---

## 🆘 Quick Troubleshooting

### Build fails
```powershell
npm run build
# Must succeed locally first
```

### Deployment fails
```powershell
eb logs --all
```

### App shows 500 error
```powershell
eb ssh
npm run db:push  # Run migrations
```

### Static files not loading
```powershell
npm run build
# Check dist/public/ folder exists
```

---

## 📋 Pre-Deployment Checklist

- [ ] `.env` is in `.gitignore` (it is ✓)
- [ ] All code pushed to GitHub
- [ ] `npm run build` succeeds locally
- [ ] AWS account created
- [ ] AWS credentials configured
- [ ] `.ebextensions/` folder exists in repo

---

## 🚀 Next Steps

1. **Read**: `DEPLOYMENT_CHECKLIST.md` (takes 5 min to understand phases)
2. **Setup**: Follow "Fastest Path" above (15 min)
3. **Deploy**: Run `eb deploy`
4. **Test**: Go to `eb open` and test your app

**Questions?** Check `AWS_DEPLOYMENT_GUIDE.md` for detailed explanations.

---

**Your app is production-ready. Deploy with confidence! 🎉**
