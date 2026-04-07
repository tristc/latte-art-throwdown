# Latte Art Throwdown PWA

A comprehensive Progressive Web App for managing Latte Art Throwdown competitions.

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth, Database, Storage)
- Prisma ORM
- TypeScript
- Tailwind CSS
- PWA Support

## Features

- Authentication & Role-Based Access Control
- Event Management
- Competitor Registration
- Bracket Generation
- Heat Management with Timers
- Blind Judging System
- Photo Upload & Voting
- Leaderboards
- Sponsor Management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

## Deployment to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## PWA Installation

- iOS: Safari > Share > Add to Home Screen
- Android: Chrome > Menu > Add to Home Screen
