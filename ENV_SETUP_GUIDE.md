# Environment Setup Guide

This guide will help you set up the environment variables needed to run the WeddingInvite.ai application.

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file with your actual credentials** (see sections below)

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Push database schema:**
   ```bash
   npm run db:push
   ```

5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## Environment Variables Reference

### 1. Database Configuration (PostgreSQL/AWS RDS)

#### `DATABASE_URL` (Required)
Your PostgreSQL database connection string.

**Format:**
```
postgresql://username:password@host:port/database?sslmode=no-verify
```

**Example for AWS RDS:**
```env
DATABASE_URL=postgresql://postgres:mypassword@database-name.xxxxx.ap-south-1.rds.amazonaws.com:5432/postgres?sslmode=no-verify
```

**Note:** 
- Replace `mypassword` with your actual database password
- URL-encode special characters in password (e.g., `@` becomes `%40`, `#` becomes `%23`)
- Add `?sslmode=no-verify` at the end for AWS RDS or other cloud databases

#### `DATABASE_SSL_ENABLED` (Required for cloud databases)
Set to `true` to enable SSL connections (required for AWS RDS, Heroku Postgres, etc.)

```env
DATABASE_SSL_ENABLED=true
```

#### `DATABASE_SSL_REJECT_UNAUTHORIZED` (Required for cloud databases)
Set to `false` to accept self-signed certificates from cloud database providers.

```env
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

---

### 2. Firebase Configuration

#### Firebase Admin SDK (Server-side)

##### `FIREBASE_SERVICE_ACCOUNT` (Required)
Your Firebase service account credentials as a single-line JSON string.

**How to get it:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Convert it to a single-line string (remove line breaks)
7. Keep the `\n` characters in the private_key field as literal `\n` (not actual line breaks)

**Example:**
```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project",...}'
```

#### Firebase Client SDK (Client-side)

These variables are exposed to the browser and must start with `VITE_` prefix.

**How to get them:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **General**
4. Scroll to **Your Apps** section
5. Click on your web app (or create one if you haven't)
6. Copy the config values

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

### 3. Razorpay Payment Gateway

#### `RAZORPAY_KEY_ID` (Required)
Your Razorpay API Key ID

#### `RAZORPAY_KEY_SECRET` (Required)
Your Razorpay API Key Secret

**How to get them:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** > **API Keys**
3. Generate new keys (use Test mode for development)

**Development (Test Mode):**
```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
```

**Production (Live Mode):**
```env
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
```

---

## Common Issues & Solutions

### Issue: "no pg_hba.conf entry for host" or "no encryption"
**Solution:** Make sure your DATABASE_URL includes `?sslmode=no-verify` and set:
```env
DATABASE_SSL_ENABLED=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Issue: "self-signed certificate in certificate chain"
**Solution:** Set `DATABASE_SSL_REJECT_UNAUTHORIZED=false` in your .env file

### Issue: Firebase authentication not working
**Solution:** 
- Check that FIREBASE_SERVICE_ACCOUNT is a valid single-line JSON string
- Ensure all `\n` characters in the private_key are escaped properly
- Verify the service account has proper permissions in Firebase Console

### Issue: Razorpay payments failing
**Solution:**
- Use test mode keys (rzp_test_...) during development
- Switch to live mode keys (rzp_live_...) only in production
- Ensure your Razorpay account is activated for live transactions

---

## Database Setup

### First Time Setup

1. **Create the database tables:**
   ```bash
   npm run db:push
   ```

2. **Seed sample data (optional):**
   ```bash
   npm run seed
   ```
   
   This will populate your database with:
   - 6 music tracks
   - 30 templates (cards and videos)
   - 2 sample users
   - Sample projects and orders

### Reset Database

To reset your database and start fresh:

```bash
# Drop all tables and recreate schema
npm run db:push

# Re-seed with sample data
npm run seed
```

---

## Security Best Practices

1. **Never commit `.env` file to version control**
   - The `.env` file is already in `.gitignore`
   - Always use `.env.example` for team reference

2. **Use different credentials for development and production**
   - Development: Test mode API keys
   - Production: Live mode API keys with proper rate limiting

3. **Rotate credentials regularly**
   - Change database passwords
   - Regenerate API keys periodically
   - Update Firebase service accounts if compromised

4. **Restrict database access**
   - Use strong passwords
   - Enable firewall rules (allow only your server IPs)
   - Use IAM roles instead of credentials where possible

---

## AWS RDS Specific Setup

If you're using AWS RDS for PostgreSQL:

1. **Security Group Configuration:**
   - Allow inbound traffic on port 5432 from your IP/server
   - Enable SSL/TLS encryption

2. **Parameter Groups:**
   - Set `rds.force_ssl = 1` for enforced SSL connections

3. **Connection String:**
   ```env
   DATABASE_URL=postgresql://username:password@your-instance.rds.amazonaws.com:5432/dbname?sslmode=no-verify
   DATABASE_SSL_ENABLED=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=false
   ```

---

## Support

If you encounter any issues:
1. Check the error logs in the terminal
2. Verify all environment variables are set correctly
3. Ensure your database is accessible from your machine
4. Check Firebase Console and Razorpay Dashboard for any service issues

For more help, contact the development team.
