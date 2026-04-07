# Latte Art Throwdown PWA - Deployment Guide

## Quick Deploy (Recommended)

### Option 1: One-Click Deploy (Fastest)

I've prepared the app for instant deployment. You have two paths:

#### Path A: Vercel + Supabase (Recommended for Production)

**Step 1: Push to GitHub**
```bash
cd /root/.openclaw/workspace/my-app

# Create GitHub repo first at https://github.com/new
# Then:
git remote add origin https://github.com/YOUR_USERNAME/latte-art-throwdown.git
git push -u origin master
```

**Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo
4. Add environment variables (see below)
5. Click Deploy

**Step 3: Set up Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get your credentials from Settings > API
4. Add to Vercel environment variables

---

### Option 2: Manual Setup with CLI

**Prerequisites:**
- Node.js 18+ installed
- Vercel account
- Supabase account

**Step 1: Install CLI tools**
```bash
npm install -g vercel
npm install -g supabase
```

**Step 2: Login to services**
```bash
vercel login
supabase login
```

**Step 3: Create Supabase project**
```bash
supabase projects create latte-art-throwdown
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

**Step 4: Deploy to Vercel**
```bash
cd /root/.openclaw/workspace/my-app
vercel --prod
```

---

## Environment Variables Required

Add these to Vercel dashboard (Settings > Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-database-connection-string
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
JWT_SECRET=generate-a-random-secret-min-32-chars
```

---

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Create a test event
- [ ] Test bracket generation
- [ ] Test timer functionality
- [ ] Test on mobile (PWA installation)

---

## Troubleshooting

**Build fails:**
```bash
# Regenerate Prisma client
npx prisma generate
```

**Database connection issues:**
- Check DATABASE_URL format
- Ensure Supabase project is active
- Verify IP allowlist in Supabase

**Auth not working:**
- Verify all Supabase environment variables
- Check redirect URLs in Supabase Auth settings

---

## Live URL

Once deployed, your app will be available at:
`https://latte-art-throwdown.vercel.app` (or your custom domain)

---

## Code Location

All deployment-ready code is in:
`/root/.openclaw/workspace/my-app/`

## Features Ready to Deploy

✅ User authentication (email/password)
✅ Event creation & management
✅ Competitor registration
✅ Bracket generation (single elimination)
✅ Heat management with timers
✅ Blind judging system
✅ Photo upload
✅ Real-time updates
✅ PWA support (installable)
✅ Responsive design

---

**Need help?** The code is ready — you just need to connect your accounts and deploy!
