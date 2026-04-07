# Latte Art Throwdown - Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Give it a name (e.g., "latte-art-throwdown")
4. Choose a region close to your users
5. Create the project

## 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy the following:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key: `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 3. Set Up Database Tables

Go to the SQL Editor and run the SQL from `supabase/setup.sql`

Or create tables manually through the Table Editor:

### Required Tables:

1. **users** (extends auth.users)
   - id: uuid (primary key)
   - email: text (unique)
   - password: text
   - first_name: text
   - last_name: text
   - avatar_url: text (nullable)
   - role: enum (see below)
   - email_verified: timestamptz (nullable)
   - created_at: timestamptz
   - updated_at: timestamptz

2. **events**
   - id: uuid (primary key, default: gen_random_uuid())
   - name: text
   - description: text (nullable)
   - location: text
   - start_date: timestamptz
   - end_date: timestamptz (nullable)
   - format: enum ('MATCH_PATTERN', 'FREESTYLE')
   - practice_time: int (default: 180)
   - service_time: int (default: 300)
   - cleanup_time: int (default: 120)
   - voting_enabled: boolean (default: true)
   - voting_ends_at: timestamptz (nullable)
   - director_id: uuid (foreign key to users)
   - host_id: uuid (foreign key to users, nullable)
   - created_at: timestamptz
   - updated_at: timestamptz

3. **competitors**
   - id: uuid (primary key)
   - user_id: uuid (foreign key to users)
   - event_id: uuid (foreign key to events)
   - nickname: text (nullable)
   - bio: text (nullable)
   - photo_url: text (nullable)
   - seed: int (nullable)
   - created_at: timestamptz

4. **heats**
   - id: uuid (primary key)
   - event_id: uuid (foreign key to events)
   - competitor_a_id: uuid (foreign key to competitors)
   - competitor_b_id: uuid (foreign key to competitors)
   - round: int
   - position: int
   - next_heat_id: uuid (nullable, self-reference)
   - status: enum ('SCHEDULED', 'PRACTICE', 'SERVICE', 'CLEANUP', 'COMPLETED')
   - scheduled_time: timestamptz (nullable)
   - started_at: timestamptz (nullable)
   - practice_ends_at: timestamptz (nullable)
   - service_ends_at: timestamptz (nullable)
   - cleanup_ends_at: timestamptz (nullable)
   - completed_at: timestamptz (nullable)
   - winner_id: uuid (nullable, foreign key to competitors)
   - created_at: timestamptz
   - updated_at: timestamptz

5. **votes**
   - id: uuid (primary key)
   - heat_id: uuid (foreign key to heats)
   - judge_id: uuid (foreign key to users)
   - choice: enum ('LEFT', 'RIGHT')
   - competitor_a_choice: boolean
   - created_at: timestamptz

6. **photos**
   - id: uuid (primary key)
   - heat_id: uuid (foreign key to heats)
   - competitor_id: uuid (foreign key to competitors)
   - image_url: text
   - thumbnail_url: text (nullable)
   - uploaded_by_id: uuid (foreign key to users)
   - uploaded_at: timestamptz
   - created_at: timestamptz

7. **public_votes**
   - id: uuid (primary key)
   - photo_id: uuid (foreign key to photos)
   - voter_id: uuid (foreign key to users)
   - created_at: timestamptz

8. **sponsors**
   - id: uuid (primary key)
   - event_id: uuid (foreign key to events)
   - name: text
   - tier: enum ('BROUGHT_TO_YOU_BY', 'PARTNERED_WITH', 'SUPPORTED_BY')
   - logo_url: text (nullable)
   - website_url: text (nullable)
   - description: text (nullable)
   - created_at: timestamptz

9. **brackets**
   - id: uuid (primary key)
   - event_id: uuid (foreign key to events, unique)
   - structure: jsonb
   - champion_id: uuid (nullable)
   - runner_up_id: uuid (nullable)
   - created_at: timestamptz
   - updated_at: timestamptz

10. **judge_assignments**
    - id: uuid (primary key)
    - heat_id: uuid (foreign key to heats)
    - judge_id: uuid (foreign key to users)
    - created_at: timestamptz

## 4. Create Storage Buckets

1. Go to Storage in the sidebar
2. Create a new bucket called "profiles"
3. Set it to Public
4. Create another bucket called "photos"
5. Set it to Public

## 5. Set Up Environment Variables

Create a `.env.local` file in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-random-secret-key
```

## 6. Run Migrations

```bash
npx prisma migrate dev
```

## 7. Push Schema to Supabase

```bash
npx prisma db push
```

## 8. Start Development Server

```bash
npm run dev
```

## Enums to Create

Create these enums in Supabase:

```sql
CREATE TYPE user_role AS ENUM (
  'EVENT_DIRECTOR', 'SPONSOR_TIER_1', 'SPONSOR_TIER_2', 'SPONSOR_TIER_3',
  'HOST', 'CO_HOST', 'STATION_MANAGER', 'RESET_CREW', 'VOLUNTEER',
  'VISUAL_JUDGE', 'GENERAL_MEMBER', 'COMPETITOR', 'COACH',
  'COMPETITOR_ASSISTANT', 'EMCEE'
);

CREATE TYPE event_format AS ENUM ('MATCH_PATTERN', 'FREESTYLE');
CREATE TYPE heat_status AS ENUM ('SCHEDULED', 'PRACTICE', 'SERVICE', 'CLEANUP', 'COMPLETED');
CREATE TYPE vote_choice AS ENUM ('LEFT', 'RIGHT');
CREATE TYPE sponsor_tier AS ENUM ('BROUGHT_TO_YOU_BY', 'PARTNERED_WITH', 'SUPPORTED_BY');
```
