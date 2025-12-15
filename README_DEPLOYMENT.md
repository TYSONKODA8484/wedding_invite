# 🎉 Wedding Invite Platform - Deployment Ready

A full-stack **React + Express monorepo** for creating and managing digital wedding/event invitations with video support, music selection, and payment integration.

**Status**: ✅ Production-ready | 🚀 AWS-configured | 📦 Deployment guides included

---

## 📖 Documentation

### Quick Start (First Time Deploying?)
- **[QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)** - Deploy in 15 minutes ⚡

### Decision Making
- **[DEPLOYMENT_DECISION_TREE.md](DEPLOYMENT_DECISION_TREE.md)** - Choose your deployment method

### Detailed Guides
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)** - Complete guide with all options
- **[DEPLOYMENT_OVERVIEW.md](DEPLOYMENT_OVERVIEW.md)** - Architecture & how it works
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Everything at a glance

---

## 🚀 Deployment Options

### Option 1: AWS Elastic Beanstalk (⭐ Recommended)
```bash
pip install awscli awsebcli
aws configure
eb init -p "Node.js 20 running on 64bit Amazon Linux 2" wedding-invite --region ap-south-1
eb create wedding-invite-prod --instance-type t3.small
eb deploy
eb open  # View your app!
```
- **Setup**: 15 minutes
- **Cost**: $20-30/month
- **Best for**: Production, auto-scaling, managed infrastructure

### Option 2: EC2 + PM2
See [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md) for full steps
- **Setup**: 30 minutes
- **Cost**: $10-15/month
- **Best for**: Full control, budget-conscious

### Option 3: GitHub Actions (Auto-Deploy)
Add GitHub secrets and auto-deploy on every push to main
- **Setup**: 5 minutes (after EB)
- **Cost**: Same as EB
- **Best for**: Zero manual work

---

## 📋 Pre-Deployment Checklist

- [ ] `npm run build` succeeds locally
- [ ] All code pushed to GitHub
- [ ] AWS account created
- [ ] AWS CLI configured: `aws configure`
- [ ] EB CLI installed: `pip install awsebcli`
- [ ] `.env` is in `.gitignore` ✓ (already is)
- [ ] `.env.example` has placeholders ✓ (already is)

---

## 🏗️ Project Structure

```
wedding-invite/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── pages/         # Page components
│       ├── components/    # Reusable components
│       └── lib/           # Utilities, S3 upload, etc.
│
├── server/                 # Express backend
│   ├── index.ts           # Main server
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   ├── s3.ts              # S3 upload handling
│   ├── razorpay.ts        # Payment processing
│   └── ...
│
├── shared/                 # Shared types & schema
│   └── schema.ts          # Database schema (Drizzle)
│
├── .ebextensions/          # AWS Elastic Beanstalk config ✨
│   ├── 01_nodecommand.config
│   ├── 02_deploy.config
│   └── 03_nginx.config
│
├── .github/workflows/      # GitHub Actions CI/CD ✨
│   └── deploy.yml
│
└── [Deployment Guides] ✨
    ├── QUICK_START_DEPLOYMENT.md
    ├── DEPLOYMENT_CHECKLIST.md
    ├── DEPLOYMENT_DECISION_TREE.md
    ├── AWS_DEPLOYMENT_GUIDE.md
    ├── DEPLOYMENT_OVERVIEW.md
    └── DEPLOYMENT_SUMMARY.md
```

**✨ = New for deployment**

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast bundler
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library

### Backend
- **Express.js** - Web server
- **TypeScript** - Type safety
- **PostgreSQL** - Database (via AWS RDS)
- **Drizzle ORM** - Database access
- **Firebase Auth** - Authentication

### Infrastructure
- **AWS Elastic Beanstalk** - Hosting (recommended)
- **AWS RDS** - PostgreSQL database
- **AWS S3** - File storage (photos, music, videos)
- **AWS CloudWatch** - Logging
- **GitHub Actions** - CI/CD

### Payments & Services
- **Razorpay** - Payment processing
- **Firebase Admin SDK** - Authentication
- **AWS SDK** - S3 file operations

---

## 📦 Build & Development

### Local Development
```bash
npm install
npm run dev         # Start dev server
npm run check       # Type check
npm run build       # Production build
```

### Database
```bash
npm run db:push     # Run migrations
npm run seed        # Seed sample data
npm run db:clear    # Clear database
```

### Scripts
```bash
npm run build                # Build both frontend & backend
npm run start                # Run production build
npm run dev                  # Development mode (tsx + Vite)
npm run check                # TypeScript type checking
npm run db:push              # Drizzle migrations
npm run seed                 # Seed database
npm run cleanup:music        # Remove duplicate music
npm run fix:template-types   # Fix template type issues
npm run db:clear             # Delete all database records
```

---

## 🌍 Environment Variables

### Development (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/weddings
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
FIREBASE_SERVICE_ACCOUNT=your-json
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
SESSION_SECRET=your-secret
```

### Production (Set via EB)
Same as development, but `NODE_ENV=production`

⚠️ **Never commit `.env`** - it's in `.gitignore`

---

## 📊 Architecture

```
Users (Browser/App)
    ↓ HTTPS
AWS ELB (Load Balancer)
    ↓ HTTP
EC2 Instance(s)
├── Nginx (reverse proxy)
└── Express Server
    ├── React Frontend (static)
    ├── API Routes
    └── Database Pool
         ↓
AWS RDS (PostgreSQL)

External Services:
├── AWS S3 (file storage)
├── Firebase (auth)
└── Razorpay (payments)
```

---

## 💾 What You Get After Deployment

✅ **Live Web App** - Accessible from anywhere  
✅ **Auto-Scaling** - Grows with traffic (EB only)  
✅ **Database** - AWS RDS with auto-backups  
✅ **File Storage** - AWS S3 for photos/music/videos  
✅ **Logging** - CloudWatch logs for debugging  
✅ **SSL/HTTPS** - Automatic certificate management  
✅ **Rollbacks** - Easy version rollback if needed  
✅ **Monitoring** - CloudWatch metrics & alarms  

---

## 💰 Cost Estimate (Monthly)

| Component | Cost |
|-----------|------|
| Elastic Beanstalk (t3.small) | $15-20 |
| RDS (db.t3.micro, free tier) | $0-50 |
| S3 storage (1GB) | $0.02 |
| Data transfer | $0-5 |
| **Total** | **~$20-70/month** |

**Free tier eligible** for first 12 months with appropriate instance sizes.

---

## 🆘 Troubleshooting

### Build Fails
```bash
npm run build
# Test locally first - must succeed before deploying
```

### Deployment Issues
```bash
eb logs --all       # View all logs
eb ssh              # SSH into instance
```

### Database Errors
```bash
eb ssh
npm run db:push     # Run migrations
npm run seed        # Add sample data
```

See [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md) for detailed troubleshooting.

---

## 📚 Learning Resources

- [AWS Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)

---

## 🎓 First Time Deploying?

1. **Start here**: [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)
2. **Understand options**: [DEPLOYMENT_DECISION_TREE.md](DEPLOYMENT_DECISION_TREE.md)
3. **Follow checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
4. **Deploy**: `eb deploy`
5. **View app**: `eb open`

**Total time: ~22 minutes for first deployment**

---

## 🔒 Security

- ✅ `.env` never committed (in `.gitignore`)
- ✅ HTTPS/SSL automatic with EB
- ✅ Environment variables isolated per environment
- ✅ Database credentials secured in RDS
- ✅ Firebase authentication for user accounts
- ✅ S3 credentials scoped to minimal permissions
- ✅ CORS configured for your domain only

---

## 📞 Support & Questions

- Check relevant deployment guide above
- Review troubleshooting section in [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)
- View logs: `eb logs --all`
- SSH to instance: `eb ssh`
- AWS Support: https://console.aws.amazon.com/support/

---

## 📈 Next Steps

1. ✅ Code is ready (you're reading this!)
2. 📖 Pick a deployment guide (see above)
3. 🚀 Deploy to AWS (15-30 minutes)
4. 🎉 Go live!

---

## 📄 License

MIT

---

**Ready to deploy? Start with [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)! 🚀**
