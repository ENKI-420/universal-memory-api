# Deployment Guide

## Phase-Conjugate Consciousness Runtime 2.0.0-ΛΦ

This guide covers deploying the PCR to production environments.

## Prerequisites

- Vercel account (recommended) or any Node.js hosting
- Neon PostgreSQL database
- Upstash Redis instance
- Domain name (optional)

## Environment Variables

Set these in your hosting platform:

### Required Variables

\`\`\`bash
# Database
NEON_NEON_DATABASE_URL=postgresql://...

# Redis
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Authentication (IMPORTANT: Use a strong secret in production)
JWT_SECRET=<generate-a-secure-random-string-min-32-chars>

# Node Environment
NODE_ENV=production
\`\`\`

### Optional Variables

\`\`\`bash
# IBM Quantum (if using real quantum hardware)
IBM_QUANTUM_TOKEN=your-token
\`\`\`

## Vercel Deployment

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Select the repository

### 2. Configure Project

- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: .next
- **Install Command**: `npm install`

### 3. Add Environment Variables

In the Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all required environment variables
3. Set them for Production, Preview, and Development

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Run Database Migrations

After first deployment, run migrations:

\`\`\`bash
# Using Vercel CLI
vercel env pull .env.local
npm run db:migrate
npm run db:seed
\`\`\`

Or connect to your database directly and run the SQL scripts.

## Database Setup

### 1. Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to environment variables as `NEON_DATABASE_URL`

### 2. Run Migrations

\`\`\`bash
npm run db:migrate
\`\`\`

This creates all necessary tables:
- users
- api_keys
- jobs
- job_logs
- system_metrics
- audit_logs
- lambda_phi_calibrations

### 3. Seed Initial Data

\`\`\`bash
npm run db:seed
\`\`\`

This creates default users:
- Admin: admin@phaseconjugate.io
- Researcher: researcher@phaseconjugate.io
- User: user@phaseconjugate.io

**⚠️ IMPORTANT**: Change these passwords immediately in production!

## Redis Setup

### 1. Create Upstash Redis

1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the REST API URL and Token
4. Add to environment variables

### 2. Configure Rate Limiting

The default rate limit is 100 requests per window. Adjust in `lib/rate-limiter.ts` if needed.

## Job Processor

The job processor runs quantum simulations in the background.

### Option 1: Vercel Cron Jobs

Add to `vercel.json`:

\`\`\`json
{
  "crons": [{
    "path": "/api/cron/process-jobs",
    "schedule": "*/5 * * * *"
  }]
}
\`\`\`

### Option 2: Separate Service

Deploy the processor as a separate service:

\`\`\`bash
# On your server
npm run processor
\`\`\`

Use a process manager like PM2:

\`\`\`bash
pm2 start npm --name "pcr-processor" -- run processor
pm2 save
pm2 startup
\`\`\`

## Security Checklist

- [ ] Change default user passwords
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Configure backup strategy
- [ ] Set up monitoring alerts

## Monitoring

### Health Checks

- **Public**: `GET /api/health`
- **Detailed**: `GET /api/monitoring/health` (requires auth)

### Metrics

Access metrics at `/dashboard/monitoring` (requires authentication)

### Logs

Logs are structured JSON format. Configure log aggregation:

- **Vercel**: Automatic log streaming
- **Self-hosted**: Use tools like Datadog, New Relic, or ELK stack

## Backup Strategy

### Database Backups

Neon provides automatic backups. Configure:
1. Backup frequency
2. Retention period
3. Point-in-time recovery

### Redis Backups

Upstash provides automatic persistence. No additional configuration needed.

## Scaling

### Horizontal Scaling

- Vercel automatically scales based on traffic
- Job processor can run multiple instances
- Redis handles distributed rate limiting

### Database Scaling

- Neon autoscaling handles read replicas
- Connection pooling is built-in
- Monitor query performance in dashboard

## Troubleshooting

### Database Connection Issues

\`\`\`bash
# Test connection
node -e "const {neon} = require('@neondatabase/serverless'); const sql = neon(process.env.NEON_DATABASE_URL); sql\`SELECT 1\`.then(() => console.log('✅ Connected')).catch(e => console.error('❌ Failed:', e))"
\`\`\`

### Redis Connection Issues

\`\`\`bash
# Test connection
node -e "const {Redis} = require('@upstash/redis'); const redis = new Redis({url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN}); redis.ping().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Failed:', e))"
\`\`\`

### Build Failures

- Check environment variables are set
- Verify Node.js version (18+)
- Clear build cache and retry

## Performance Optimization

### Caching Strategy

- API responses cached in Redis
- Static assets cached by CDN
- Database queries use connection pooling

### Database Optimization

- Indexes on frequently queried columns
- Pagination for large result sets
- Query optimization with EXPLAIN

### Frontend Optimization

- Code splitting with Next.js
- Image optimization with next/image
- Lazy loading for heavy components

## Support

For deployment issues:
1. Check logs in Vercel dashboard
2. Review health check endpoints
3. Monitor system metrics
4. Check audit logs for errors

## Updates

To deploy updates:

\`\`\`bash
git push origin main
\`\`\`

Vercel automatically deploys on push to main branch.

For manual deployment:

\`\`\`bash
vercel --prod
\`\`\`

---

**Phase-Conjugate Consciousness Runtime 2.0.0-ΛΦ**  
*Production-ready quantum computing platform*
