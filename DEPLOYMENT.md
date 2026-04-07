# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a GitHub/GitLab/Bitbucket repository
3. Your Supabase project set up

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/latte-art-throwdown.git
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Select the "latte-art-throwdown" project

### 3. Configure Project Settings

**Framework Preset:** Next.js

**Build Command:** `npm run build`

**Output Directory:** `.next`

**Install Command:** `npm install`

### 4. Add Environment Variables

Add these environment variables in the Vercel dashboard:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `DATABASE_URL` | Your Supabase database connection string |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
| `JWT_SECRET` | A random secret string (generate with `openssl rand -base64 32`) |

### 5. Deploy

Click "Deploy" and wait for the build to complete.

### 6. Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 7. Update Supabase Settings

After deployment, update your Supabase project:

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your production URL to:
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: `https://your-domain.vercel.app/auth/callback`

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Create a test event
- [ ] Register as a competitor
- [ ] Test bracket generation
- [ ] Test heat timer
- [ ] Test blind judging
- [ ] Test photo upload
- [ ] Test PWA installation on mobile

## Troubleshooting

### Build Errors

**Error: "Module not found"**
- Run `npm install` locally and commit package-lock.json

**Error: "Prisma Client not found"**
- Add `npx prisma generate` to your build command:
  ```
  npx prisma generate && next build
  ```

### Runtime Errors

**Error: "Cannot connect to database"**
- Verify DATABASE_URL is correct
- Check Supabase connection pooler settings
- Ensure your IP is not restricted

**Error: "Supabase auth not working"**
- Verify all Supabase environment variables
- Check redirect URLs in Supabase dashboard
- Ensure Site URL matches your deployment URL

## Performance Optimization

### Enable Vercel Analytics

1. Go to Project Settings > Analytics
2. Enable Web Analytics

### Enable Image Optimization

Already configured in next.config.mjs:
```javascript
images: {
  domains: ['localhost', '*.supabase.co'],
}
```

### Enable Edge Functions (Optional)

For API routes that need edge performance:
```typescript
export const runtime = 'edge';
```

## Monitoring

- Use Vercel Analytics for performance monitoring
- Use Supabase Dashboard for database monitoring
- Set up Sentry for error tracking (optional)

## Updates

To deploy updates:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically deploy your changes.
