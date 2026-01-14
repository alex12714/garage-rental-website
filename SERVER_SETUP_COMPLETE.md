# ✅ Server Setup Complete for garage.podbrezsky.com

## What Has Been Configured

### 🖥️ Server Infrastructure (Hetzner)

**Server Details:**
- IP: 65.109.160.82
- Domain: garage.podbrezsky.com
- SSH: hetzner-websites

**Docker Services Configured:**
- ✅ New service `garage-podbrezsky` added to docker-compose.yml
- ✅ Traefik routing configured for automatic HTTPS
- ✅ Let's Encrypt SSL certificate (will be generated on first deployment)
- ✅ Internal port 3000 → External HTTPS port 443

### 📁 Server Directory Structure

```
/data/websites/garage.podbrezsky.com/
├── repo/                          # Empty - waiting for git push
├── .env-data/.env                # ✅ Production environment variables configured
└── deploy.sh                     # ✅ Automatic deployment script
```

### 🔐 Environment Variables (Configured)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[REDACTED]         ✅
STRIPE_SECRET_KEY=[REDACTED]                           ✅
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[REDACTED]            ✅
WEBHOOK_URL=[REDACTED]                                 ✅
NEXT_PUBLIC_SITE_URL=https://garage.podbrezsky.com     ✅
```

### 🪝 GitHub Webhook Integration

**Webhook Server Updated:**
- URL: https://webhook.hud.onfire.so
- Secret: 19b5c5727fd3cb7474607f433d1060d45155220fd2cae77ac180a8759962b1be
- Repository: garage-rental-website
- Status: ✅ Server configured and restarted

### 🐳 Docker Configuration

**Service Added to `/data/websites/docker-compose.yml`:**
```yaml
garage-podbrezsky:
  build: /data/websites/garage.podbrezsky.com/repo
  container_name: garage-podbrezsky-com
  restart: unless-stopped
  env_file:
    - /data/websites/garage.podbrezsky.com/.env-data/.env
  networks:
    - coolify
  labels:
    - traefik.enable=true
    - traefik.http.routers.garage-https.rule=Host(`garage.podbrezsky.com`)
    - traefik.http.routers.garage-https.tls.certresolver=letsencrypt
    - traefik.http.services.garage.loadbalancer.server.port=3000
```

### 🚀 Deployment Script

**Location:** `/data/websites/garage.podbrezsky.com/deploy.sh`

**What it does:**
1. Pulls latest code from GitHub
2. Builds Docker image with Next.js app
3. Restarts container
4. Automatic execution on every git push

---

## 🎯 What You Need to Do

### 1. Create GitHub Repository
- Go to: https://github.com/new
- Name: `garage-rental-website`
- Visibility: Private

### 2. Push Code
```bash
gh auth login  # Or use personal access token
git push -u origin main
```

### 3. Configure GitHub Webhook
- Settings → Webhooks → Add webhook
- URL: `https://webhook.hud.onfire.so`
- Secret: `19b5c5727fd3cb7474607f433d1060d45155220fd2cae77ac180a8759962b1be`
- Events: Just push events

### 4. Trigger Initial Deployment
```bash
ssh hetzner-websites "bash /data/websites/garage.podbrezsky.com/deploy.sh"
```

### 5. Access Your Website
Wait 2-3 minutes, then visit:
https://garage.podbrezsky.com

---

## 📝 Files Ready for Deployment

**Local Repository:**
- ✅ Dockerfile (multi-stage build)
- ✅ .dockerignore (optimized build)
- ✅ DEPLOYMENT.md (complete guide)
- ✅ All application code committed

**Ready to Push:**
- 3 commits ready
- 40 files total
- ~10,800 lines of code

---

## 🔄 Automatic Deployment Flow

```
git push origin main
    ↓
GitHub sends webhook
    ↓
webhook.hud.onfire.so receives
    ↓
Executes deploy.sh
    ↓
Pulls latest code
    ↓
Builds Docker image
    ↓
Restarts container
    ↓
Live in ~1-2 minutes
```

---

## ✨ Features Enabled

- ✅ Multi-language support (LV/EN/RU)
- ✅ Stripe payment integration
- ✅ Google Maps location display
- ✅ SMS notifications (via Make.com webhook)
- ✅ Video walkthrough access
- ✅ Terms & Conditions with 24h cancellation
- ✅ Automatic HTTPS/SSL
- ✅ Zero-downtime deployments
- ✅ Production-ready Next.js build

---

**Everything is configured and ready. Just push to GitHub and you're live! 🚀**

See DEPLOYMENT.md for detailed instructions and troubleshooting.
