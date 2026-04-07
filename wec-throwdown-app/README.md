# WEC Latte Art Throwdown Platform

Complete event management software for latte art throwdowns, smackdowns, and battles.

## Project Structure

```
wec-throwdown-app/
├── backend/          # Node.js + Express API
├── frontend/         # React web app
└── database/         # Schema and migrations
```

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Core Features

### For Competitors
- Event discovery and registration
- QR code check-in
- Real-time bracket viewing
- Match notifications
- Performance history

### For Organizers
- Event creation wizard
- Bracket auto-generation
- Competitor management
- Volunteer coordination
- Analytics dashboard

### For Staff/Volunteers
- QR scanner check-in
- Digital scorecards
- Timer control
- Role-based dashboards

## Tech Stack

**Backend:** Node.js, Express, PostgreSQL, Socket.io
**Frontend:** React, Tailwind CSS, React Query
**Real-time:** WebSockets for live bracket updates
