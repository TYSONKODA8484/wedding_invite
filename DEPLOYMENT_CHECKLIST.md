# AWS Deployment Checklist - Wedding Invite

Complete these steps to deploy your app to AWS Elastic Beanstalk.

---

## 📋 Phase 1: AWS Account Setup (One-time)

### 1.1 AWS Account & Credentials
- [ ] Create AWS Account at https://aws.amazon.com
- [ ] Create IAM User for deployment:
  - Go to **IAM Dashboard** → Users → Add User
  - Username: `wedding-invite-deploy`
  - Permissions: `AdministratorAccess` (or custom: ElasticBeanstalk, RDS, S3, IAM)
  - Download **Access Key ID** and **Secret Access Key**

### 1.2 Configure AWS CLI Locally
```powershell
aws configure
# Enter:
# - AWS Access Key ID: [from IAM user]
# - AWS Secret Access Key: [from IAM user]
# - Default region: ap-south-1 (or your region)
# - Default output: json
```

### 1.3 Install EB CLI
```powershell
pip install awsebcli --upgrade --user
```

---

## 🗄️ Phase 2: Database Setup (RDS)

### 2.1 Create PostgreSQL Database
1. Go to **RDS Dashboard** → Databases → Create Database
2. **Engine**: PostgreSQL (version 15+)
3. **Template**: Free tier (if eligible)
4. **DB instance identifier**: `wedding-invites-db`
5. **Master username**: `postgres`
6. **Master password**: Generate strong password (save it!)
7. **DB subnet group**: default-vpc
8. **Public accessibility**: No (unless you need remote access)
9. **Initial database name**: `weddings`

### 2.2 Save Connection String
After RDS is created, go to **Databases** → Select your DB → **Connectivity & security**

Copy the **Endpoint** (e.g., `wedding-invites-db.c9akciq32.ap-south-1.rds.amazonaws.com`)

Your connection string will be:
```
postgresql://postgres:YOUR_PASSWORD@wedding-invites-db.c9akciq32.ap-south-1.rds.amazonaws.com:5432/weddings
```

- [ ] Save this somewhere secure (you'll need it for EB env vars)

### 2.3 Allow EB Security Group Access to RDS
1. Go to **RDS** → Databases → Your DB → **VPC security groups**
2. Click the security group
3. Edit **Inbound rules** → Add rule:
   - **Type**: PostgreSQL
   - **Port range**: 5432
   - **Source**: Search for `elasticbeanstalk-default` security group
   - **Save**

---

## 🪣 Phase 3: S3 Setup

### 3.1 Create S3 Bucket
```powershell
aws s3api create-bucket `
  --bucket wedding-invite-bucket `
  --region ap-south-1 `
  --create-bucket-configuration LocationConstraint=ap-south-1
```

Or via AWS Console:
1. Go to **S3** → Create Bucket
2. **Bucket name**: `wedding-invite-bucket` (must be globally unique)
3. **Region**: ap-south-1
4. **Block Public Access**: ✓ all checked (for now)
5. **Create**

### 3.2 Enable CORS
```powershell
# Save this as cors.json:
```

Create file `cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Then:
```powershell
aws s3api put-bucket-cors `
  --bucket wedding-invite-bucket `
  --cors-configuration file://cors.json
```

### 3.3 Create IAM User for S3 Access
1. Go to **IAM** → Users → Add User
2. **Username**: `wedding-invite-s3`
3. **Access type**: Programmatic access
4. **Next** → Attach policies → Search `AmazonS3FullAccess` → Check it
5. **Next** → Create user
6. **Download CSV** with Access Key ID and Secret Access Key

- [ ] Save these credentials

---

## 🚀 Phase 4: Elastic Beanstalk Setup

### 4.1 Initialize EB in Your Project
```powershell
cd D:\WeddingInvite.ai\Web\WedInvitesSEO

# First time only
eb init -p "Node.js 20 running on 64bit Amazon Linux 2" wedding-invite --region ap-south-1
```

When prompted:
- **Use CodeCommit?** → No (using GitHub)
- **Set up SSH?** → Yes

### 4.2 Verify `.ebextensions` Files
Check that these files exist:
- [ ] `.ebextensions/01_nodecommand.config`
- [ ] `.ebextensions/02_deploy.config`
- [ ] `.ebextensions/03_nginx.config`

### 4.3 Create EB Environment
Option A: Via CLI
```powershell
eb create wedding-invite-prod `
  --instance-type t3.small `
  --scale 1 `
  --envvars NODE_ENV=production
```

Option B: Via AWS Console (easier)
1. Go to **Elastic Beanstalk** → Applications → Create application
2. **Application name**: `wedding-invite`
3. **Platform**: Node.js 20 running on 64bit Amazon Linux 2
4. **Create environment** → Production
5. **Environment name**: `wedding-invite-prod`
6. **Upload your code** (ZIP containing `.ebextensions` folder)

### 4.4 Set Environment Variables
Via CLI:
```powershell
eb setenv `
  NODE_ENV=production `
  DATABASE_URL="postgresql://postgres:PASSWORD@rds-endpoint:5432/weddings" `
  DATABASE_SSL_ENABLED=true `
  AWS_REGION=ap-south-1 `
  AWS_S3_BUCKET=wedding-invite-bucket `
  AWS_ACCESS_KEY_ID=AKIA... `
  AWS_SECRET_ACCESS_KEY=... `
  AWS_S3_BASE_URL=https://wedding-invite-bucket.s3.ap-south-1.amazonaws.com `
  FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' `
  RAZORPAY_KEY_ID=... `
  RAZORPAY_KEY_SECRET=... `
  SESSION_SECRET=your-random-secret-string
```

Or via AWS Console:
1. Go to **Elastic Beanstalk** → Environments → Your environment
2. **Configuration** → Updates and deployments → Environment properties
3. Add each key-value pair

---

## 🛠️ Phase 5: Build & Deploy

### 5.1 Build Locally First
```powershell
npm run build
```

- [ ] Build succeeds without errors

### 5.2 Commit to GitHub
```powershell
git add .
git commit -m "feat: add AWS deployment configs"
git push origin main
```

### 5.3 Deploy to EB
Option A: Using deploy script
```powershell
bash deploy.sh
```

Option B: Manual deploy
```powershell
eb deploy
```

Option C: Using GitHub Actions (automatic on every push to main)
- Just push to main, and Actions will auto-deploy

### 5.4 Monitor Deployment
```powershell
# View logs
eb logs --all

# Check status
eb status

# SSH into instance
eb ssh

# Open app in browser
eb open
```

- [ ] Deployment succeeds
- [ ] App loads without 500 errors
- [ ] Database migrations run

---

## 🔍 Phase 6: Post-Deployment

### 6.1 Database Initialization (if first deploy)
```powershell
eb ssh

# On the EC2 instance:
npm run db:push    # Run migrations
npm run seed       # Optional: seed sample data

exit
```

### 6.2 Test App
1. Open EB URL: `eb open`
2. Sign up with test account
3. Test create/download functionality
4. Check S3 bucket for uploaded files

### 6.3 Setup Custom Domain (Optional)
1. Go to **Elastic Beanstalk** → Environment → Domain
2. Change CNAME to your domain (e.g., `weddinginvite.com`)
3. Or: Go to **Route 53** and create alias record

### 6.4 Enable HTTPS
```powershell
# Install Let's Encrypt certificate (via EB)
# Add to .ebextensions/https.config

# Or use AWS Certificate Manager:
# 1. Go to ACM → Request certificate
# 2. Add your domain
# 3. Validate (via email or DNS)
# 4. Attach to ALB in EB Console
```

---

## 📊 Phase 7: Monitoring & Maintenance

### 7.1 CloudWatch Logs
- [ ] Go to **CloudWatch** → Logs → Select EB environment
- [ ] Set up alarms for errors

### 7.2 Automatic Scaling
- [ ] Go to **EB** → Configuration → Capacity
- [ ] Set min/max instances (default: 1-4)
- [ ] Save

### 7.3 Regular Backups
- [ ] Go to **RDS** → Databases → Modify
- [ ] **Backup retention**: 7 days
- [ ] **Save**

### 7.4 Cost Monitoring
- [ ] Go to **Billing** → Cost Explorer
- [ ] Set budget alert (~$50/month)

---

## 🆘 Troubleshooting

### Deployment Fails
```powershell
# View detailed logs
eb logs --all

# SSH and check manually
eb ssh
tail -f /var/log/nodejs/nodejs.log
```

### App 500 Error
```powershell
eb ssh
npm run db:push  # Ensure migrations ran
env | grep DATABASE  # Verify DB URL is set
```

### Static Files Not Loading
```powershell
# Check build output
npm run build
ls -la dist/public/

# Verify vite.config.ts has correct outDir
```

### S3 Upload Fails
```powershell
# Check S3 credentials
aws s3 ls wedding-invite-bucket/

# Verify CORS is set
aws s3api get-bucket-cors --bucket wedding-invite-bucket
```

---

## 📞 Support

- **EB Logs**: `eb logs --all`
- **SSH to instance**: `eb ssh`
- **View environment**: `eb status`
- **Redeploy**: `eb deploy`

---

## ✅ Final Verification Checklist

- [ ] AWS account and IAM user created
- [ ] RDS database created and running
- [ ] S3 bucket created with CORS enabled
- [ ] EB environment created
- [ ] All environment variables set
- [ ] Code pushed to GitHub
- [ ] First deploy successful
- [ ] App loads in browser
- [ ] Database accessible
- [ ] S3 uploads working
- [ ] Can create/edit projects
- [ ] Can download projects
- [ ] Logs show no errors

---

**You're ready to deploy! Start with Phase 1 and work through each phase.**

Questions? Check `AWS_DEPLOYMENT_GUIDE.md` for detailed instructions.
