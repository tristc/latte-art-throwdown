# 🚀 WEC Latte Art Throwdown - Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repo

3. **Add PostgreSQL**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway auto-sets `DATABASE_URL`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=5000
   ```

5. **Deploy**
   - Railway auto-deploys on every push
   - Get your domain from Settings → Domains

---

### Option 2: Render

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - "New" → "Web Service"
   - Connect your GitHub repo

2. **Configure**
   ```
   Name: wec-throwdown
   Runtime: Node
   Build Command: npm install && cd backend && npm install && cd ../frontend && npm install && npm run build
   Start Command: npm start
   ```

3. **Create PostgreSQL**
   - "New" → "PostgreSQL"
   - Copy the "Internal Database URL"

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://... (from step 3)
   JWT_SECRET=your-super-secret-jwt-key
   PORT=10000 (Render sets this automatically)
   ```

---

### Option 3: Fly.io (Best Performance)

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Launch**
   ```bash
   cd backend
   fly launch
   fly postgres create  # Create database
   fly postgres attach  # Attach to app
   ```

3. **Set Secrets**
   ```bash
   fly secrets set JWT_SECRET=your-secret
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

---

### Option 4: Docker (Any Platform)

```bash
# Build and run with Docker
docker-compose up --build
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | production / development | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 5000) | No |

### Database URL Format
```
postgresql://username:password@host:port/database
```

---

## First-Time Database Setup

After deploying, run migrations:

**Railway:**
```bash
railway run node backend/database/migrate.js
```

**Render:**
Use the "Shell" tab in your service dashboard

**Local/SSH:**
```bash
psql $DATABASE_URL -f backend/database/migrations/001_initial_schema.sql
```

---

## Frontend Build Note

The frontend builds to `frontend/build/` and the backend serves it statically:

```javascript
// In production, backend serves React build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
```

---

## Custom Domain

All platforms support custom domains:
1. Add domain in platform dashboard
2. Update DNS CNAME record
3. Wait for SSL certificate (auto-provisioned)

---

## Troubleshooting

### "Cannot find module"
Make sure `npm install` runs for both backend AND frontend during build.

### "Connection refused" to database
Check `DATABASE_URL` is set correctly and database is running.

### CORS errors
Backend is configured to allow the frontend URL. Check `FRONTEND_URL` env var if set.

### WebSocket not connecting
Make sure the platform supports WebSockets (Railway, Render, Fly all do).

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set up custom domain (optional)
- [ ] Configure backup for PostgreSQL
- [ ] Set up monitoring/alerts
- [ ] Enable HTTPS (auto on all platforms)
- [ ] Test registration flow end-to-end
- [ ] Test WebSocket real-time updates
