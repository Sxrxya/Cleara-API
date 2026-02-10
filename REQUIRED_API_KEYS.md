# 🔑 CLEARA - REQUIRED API KEYS & CONFIGURATION

This document lists all API keys, credentials, and configuration details you'll need to deploy Cleara in production.

---

## 📋 REQUIRED ITEMS

### 1. **AWS Account & Credentials** (For Backend Deployment)

**What you need:**
- AWS Account (free tier available)
- AWS Access Key ID
- AWS Secret Access Key
- AWS Region (e.g., `us-east-1`)

**How to get:**
1. Create AWS account at https://aws.amazon.com
2. Go to IAM → Users → Create User
3. Attach policies: `AmazonDynamoDBFullAccess`, `AmazonS3FullAccess`, `AWSLambdaFullAccess`
4. Create access key → Download credentials

**Where to use:**
- `backend/.env` → `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`

**Cost:** Free tier includes:
- Lambda: 1M requests/month free
- DynamoDB: 25GB storage free
- S3: 5GB storage free

---

### 2. **Stripe Account** (For Billing)

**What you need:**
- Stripe Secret Key (starts with `sk_test_` or `sk_live_`)
- Stripe Publishable Key (starts with `pk_test_` or `pk_live_`)
- Stripe Webhook Secret (starts with `whsec_`)

**How to get:**
1. Create account at https://stripe.com
2. Go to Developers → API Keys
3. Copy Secret and Publishable keys
4. Create webhook endpoint for billing events

**Where to use:**
- `backend/.env` → `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- `frontend/.env.local` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Cost:** Free to start, 2.9% + ₹2 per transaction

---

### 3. **Domain Name** (Optional but Recommended)

**What you need:**
- Custom domain (e.g., `cleara.io`)
- DNS access

**How to get:**
1. Buy domain from Namecheap, GoDaddy, or Google Domains
2. Point DNS to your hosting

**Where to use:**
- Vercel/Netlify for frontend
- AWS API Gateway for backend

**Cost:** ₹500-1,500/year

---

### 4. **Email Service** (For Notifications)

**Options:**
- **SendGrid** (Recommended)
  - Free tier: 100 emails/day
  - Get API key from https://sendgrid.com
  
- **AWS SES**
  - Free tier: 62,000 emails/month
  - Use AWS credentials

- **Resend**
  - Free tier: 3,000 emails/month
  - Modern, developer-friendly

**What you need:**
- API Key

**Where to use:**
- `backend/.env` → `EMAIL_API_KEY`, `EMAIL_FROM`

**Cost:** Free tier sufficient for start

---

### 5. **OAuth Providers** (For Social Login)

#### Google OAuth
**What you need:**
- Google Client ID
- Google Client Secret

**How to get:**
1. Go to https://console.cloud.google.com
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URIs

**Where to use:**
- `frontend/.env.local` → `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Cost:** Free

#### GitHub OAuth
**What you need:**
- GitHub Client ID
- GitHub Client Secret

**How to get:**
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Copy Client ID and Secret

**Where to use:**
- `frontend/.env.local` → `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

**Cost:** Free

---

### 6. **Monitoring & Analytics** (Optional)

#### Sentry (Error Tracking)
- Free tier: 5,000 errors/month
- Get DSN from https://sentry.io

#### Google Analytics
- Free
- Get Tracking ID from https://analytics.google.com

#### PostHog (Product Analytics)
- Free tier: 1M events/month
- Get API key from https://posthog.com

**Where to use:**
- `frontend/.env.local` → `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GA_ID`

---

### 7. **Redis/Cache** (Optional for Production)

**Options:**
- **Upstash Redis** (Recommended)
  - Free tier: 10,000 commands/day
  - Serverless, no maintenance
  - Get from https://upstash.com

- **AWS ElastiCache**
  - Paid service
  - Better for high traffic

**What you need:**
- Redis URL (e.g., `redis://user:pass@host:port`)

**Where to use:**
- `backend/.env` → `REDIS_URL`

**Cost:** Free tier available

---

### 8. **Database** (DynamoDB or Alternative)

**Primary Option: AWS DynamoDB**
- Uses AWS credentials (already covered)
- Free tier: 25GB storage

**Alternative: MongoDB Atlas**
- Free tier: 512MB storage
- Get connection string from https://mongodb.com

**What you need:**
- Connection string or AWS credentials

**Where to use:**
- `backend/.env` → `DATABASE_URL` or AWS credentials

---

### 9. **Secret Keys** (Generate Yourself)

**What you need:**
- `SECRET_KEY` for JWT tokens (random 64-character string)
- `NEXTAUTH_SECRET` for NextAuth (random 32-character string)

**How to generate:**
```bash
# For SECRET_KEY (64 chars)
openssl rand -hex 32

# For NEXTAUTH_SECRET (32 chars)
openssl rand -base64 32
```

**Where to use:**
- `backend/.env` → `SECRET_KEY`
- `frontend/.env.local` → `NEXTAUTH_SECRET`

---

## 📝 COMPLETE .ENV FILES

### Backend `.env`
```env
# Environment
ENVIRONMENT=production
DEBUG=False

# Security
SECRET_KEY=your-64-char-secret-key-here

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# DynamoDB
DYNAMODB_USERS_TABLE=cleara-users-prod
DYNAMODB_API_KEYS_TABLE=cleara-api-keys-prod
DYNAMODB_USAGE_TABLE=cleara-usage-prod

# S3
S3_MODELS_BUCKET=cleara-ml-models-prod
S3_LOGS_BUCKET=cleara-logs-prod

# Redis (Optional)
REDIS_URL=redis://default:password@host:port

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SendGrid)
EMAIL_API_KEY=SG.your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Monitoring (Optional)
SENTRY_DSN=https://...@sentry.io/...
```

### Frontend `.env.local`
```env
# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

---

## 💰 ESTIMATED COSTS

### Free Tier (0-1,000 users)
- **AWS**: $0 (free tier)
- **Vercel**: $0 (hobby plan)
- **Stripe**: Transaction fees only
- **Domain**: ₹1,000/year
- **Total**: ~₹100/month + domain

### Startup (1,000-10,000 users)
- **AWS**: $50-200/month
- **Vercel**: $20/month (Pro)
- **Stripe**: Transaction fees
- **Email**: $15/month
- **Total**: ~$100-250/month

### Growth (10,000+ users)
- **AWS**: $500-2,000/month
- **Vercel**: $20/month
- **Stripe**: Transaction fees
- **Email**: $50/month
- **Total**: ~$600-2,100/month

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deployment
- [ ] Create AWS account and get credentials
- [ ] Create Stripe account and get API keys
- [ ] Buy domain name (optional)
- [ ] Set up email service (SendGrid/SES)
- [ ] Generate secret keys
- [ ] Set up OAuth providers (Google, GitHub)
- [ ] Create all `.env` files

### During Deployment
- [ ] Deploy backend to AWS Lambda
- [ ] Deploy frontend to Vercel
- [ ] Configure custom domain
- [ ] Set up DynamoDB tables
- [ ] Upload ML models to S3
- [ ] Configure Stripe webhooks
- [ ] Test all integrations

### After Deployment
- [ ] Set up monitoring (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Test payment flow
- [ ] Test email notifications
- [ ] Load testing
- [ ] Security audit

---

## 📞 WHAT I NEED FROM YOU NOW

**For immediate testing (local development):**
- ✅ Nothing! Everything works with mock data locally

**For production deployment (when ready):**
1. **AWS Credentials** (if deploying to AWS)
2. **Stripe Keys** (if enabling billing)
3. **Domain Name** (if you have one)
4. **OAuth Client IDs** (if enabling social login)

**I can help you:**
- Set up AWS account
- Configure Stripe
- Generate secret keys
- Deploy to Vercel/AWS
- Set up monitoring

---

## 🎯 RECOMMENDED APPROACH

### Phase 1: Local Development (Now)
- Use mock data
- No API keys needed
- Test everything locally

### Phase 2: Staging Deployment (Week 1)
- Deploy to free tiers
- Use test API keys
- Get feedback

### Phase 3: Production (Week 2-3)
- Upgrade to paid tiers
- Use production API keys
- Launch publicly

---

## 💡 FREE ALTERNATIVES

If you want to minimize costs:

1. **Backend**: Railway.app (free tier) instead of AWS
2. **Database**: Supabase (free tier) instead of DynamoDB
3. **Auth**: Supabase Auth (free) instead of custom
4. **Email**: Resend (3K free) instead of SendGrid
5. **Monitoring**: Free tiers of Sentry, PostHog

**Total cost with free alternatives**: $0-20/month

---

**Let me know which deployment option you prefer, and I'll help you set it up! 🚀**
