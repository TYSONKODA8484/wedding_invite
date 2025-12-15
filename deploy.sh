#!/bin/bash

# Wedding Invite AWS Deployment Script
# Usage: bash deploy.sh

set -e

echo "🚀 Wedding Invite Deployment to AWS"
echo "===================================="

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Install: pip install awscli"
    exit 1
fi

if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Install: pip install awsebcli"
    exit 1
fi

# Step 1: Build
echo ""
echo "📦 Building application..."
npm run build
echo "✓ Build complete"

# Step 2: Check git status
echo ""
echo "🔍 Checking git status..."
if [[ $(git status -s) ]]; then
    echo "⚠️  Uncommitted changes detected. Commit them first:"
    git status -s
    exit 1
fi
echo "✓ Git is clean"

# Step 3: Initialize EB (if first time)
if [ ! -d ".elasticbeanstalk" ]; then
    echo ""
    echo "🔧 First time setup - initializing Elastic Beanstalk..."
    eb init -p "Node.js 20 running on 64bit Amazon Linux 2" wedding-invite --region ap-south-1
fi

# Step 4: Check if environment exists
echo ""
echo "🔍 Checking EB environment..."
if eb status > /dev/null 2>&1; then
    echo "✓ Environment found: $(eb status | grep 'Environment details' | head -1)"
else
    echo "❌ No EB environment found."
    echo "Create one with: eb create wedding-invite-prod --instance-type t3.small"
    exit 1
fi

# Step 5: Set environment variables
echo ""
echo "🔐 Setting environment variables..."
echo "Note: Make sure these are set in EB:"
echo "  - NODE_ENV=production"
echo "  - DATABASE_URL=<your-rds-endpoint>"
echo "  - AWS_ACCESS_KEY_ID=<your-key>"
echo "  - AWS_SECRET_ACCESS_KEY=<your-secret>"
echo "  - AWS_S3_BUCKET=<your-bucket>"
echo "  - FIREBASE_SERVICE_ACCOUNT=<your-json>"
echo "  - RAZORPAY_KEY_ID=<your-key>"
echo "  - RAZORPAY_KEY_SECRET=<your-secret>"
echo "  - SESSION_SECRET=<your-secret>"
echo ""
read -p "Have you set all environment variables? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Set them via: eb setenv KEY=value ..."
    exit 1
fi

# Step 6: Deploy
echo ""
echo "🚀 Deploying to Elastic Beanstalk..."
eb deploy

# Step 7: Monitor
echo ""
echo "📊 Deployment in progress..."
sleep 5
eb status

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  - View logs: eb logs --all"
echo "  - Open app: eb open"
echo "  - SSH: eb ssh"
echo ""
