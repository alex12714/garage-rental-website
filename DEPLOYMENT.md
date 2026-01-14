# 🚀 Deployment Guide for garage.podbrezsky.com

Your Hetzner server has been configured and is ready to host the garage rental website at `https://garage.podbrezsky.com`.

## ✅ Server Configuration Complete

The following has been set up on your server:

### 1. Directory Structure
```
/data/websites/garage.podbrezsky.com/
├── repo/              # Git repository (empty, awaiting first push)
├── .env-data/         # Environment variables
│   └── .env          # Production environment variables
└── deploy.sh         # Automatic deployment script
```

### 2. Docker Configuration
- Added `garage-podbrezsky` service to `/data/websites/docker-compose.yml`
- Configured Traefik for automatic HTTPS with Let's Encrypt
- Environment variables loaded from `/data/websites/garage.podbrezsky.com/.env-data/.env`

### 3. Webhook Integration
- Updated webhook server to support `garage-rental-website` repository
- Webhook URL: `https://webhook.hud.onfire.so`
- Webhook Secret: `19b5c5727fd3cb7474607f433d1060d45155220fd2cae77ac180a8759962b1be`

### 4. Environment Variables (Already Configured)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[REDACTED]...
STRIPE_SECRET_KEY=[REDACTED]...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[REDACTED]
WEBHOOK_URL=[REDACTED]
NEXT_PUBLIC_SITE_URL=https://garage.podbrezsky.com
```

---

## 📋 Steps to Complete Deployment

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository details:
   - **Name**: `garage-rental-website`
   - **Description**: "Hourly garage rental website with Stripe payments and multi-language support"
   - **Visibility**: Private (recommended)
   - **DO NOT** initialize with README, .gitignore, or license
3. Click **"Create repository"**

### Step 2: Push Code to GitHub

Your local repository is already configured with the remote. You need to authenticate and push:

```bash
# If using GitHub CLI (recommended)
gh auth login
git push -u origin main

# OR using personal access token
# 1. Create token at: https://github.com/settings/tokens/new
#    - Select scopes: repo (all)
#    - Copy the token
# 2. Push using token as password
git push -u origin main
# Username: apodbrezsky
# Password: [paste your personal access token]
```

### Step 3: Configure GitHub Webhook

1. Go to your repository settings:
   - https://github.com/apodbrezsky/garage-rental-website/settings/hooks

2. Click **"Add webhook"**

3. Configure webhook:
   - **Payload URL**: `https://webhook.hud.onfire.so`
   - **Content type**: `application/json`
   - **Secret**: `19b5c5727fd3cb7474607f433d1060d45155220fd2cae77ac180a8759962b1be`
   - **Which events**: Select "Just the push event"
   - **Active**: ✅ Checked

4. Click **"Add webhook"**

### Step 4: Initial Deployment

After pushing to GitHub and setting up the webhook, manually trigger the first deployment:

```bash
ssh hetzner-websites "bash /data/websites/garage.podbrezsky.com/deploy.sh"
```

This will:
- Clone the repository
- Build the Next.js application in Docker
- Start the container
- Configure SSL certificate automatically

### Step 5: Verify Deployment

1. Wait 2-3 minutes for the initial build and SSL certificate
2. Visit: https://garage.podbrezsky.com
3. Test booking flow with Stripe test mode (if needed)

---

## 🔄 Automatic Deployments

After initial setup, every `git push` to the `main` branch will automatically:
1. Trigger the GitHub webhook
2. Pull latest code on the server
3. Rebuild the Docker container
4. Restart the service
5. Your changes go live in ~1-2 minutes

---

## 🛠️ Useful Commands

### View Logs
```bash
ssh hetzner-websites "docker logs -f garage-podbrezsky-com"
```

### Restart Service
```bash
ssh hetzner-websites "cd /data/websites && docker compose restart garage-podbrezsky"
```

### Rebuild from Scratch
```bash
ssh hetzner-websites "cd /data/websites && docker compose up -d --build --force-recreate garage-podbrezsky"
```

### Check Service Status
```bash
ssh hetzner-websites "docker ps | grep garage"
```

### Manual Deployment
```bash
ssh hetzner-websites "bash /data/websites/garage.podbrezsky.com/deploy.sh"
```

---

## 🔍 Troubleshooting

### Container Not Starting
```bash
# Check logs
ssh hetzner-websites "docker logs garage-podbrezsky-com"

# Check if port 3000 is available
ssh hetzner-websites "docker ps | grep 3000"
```

### SSL Certificate Issues
```bash
# Check Traefik logs
ssh hetzner-websites "docker logs coolify-proxy | grep garage"

# Force SSL certificate renewal
ssh hetzner-websites "docker exec coolify-proxy traefik version"
```

### Build Errors
```bash
# SSH into the container
ssh hetzner-websites "docker exec -it garage-podbrezsky-com sh"

# Check build logs
ssh hetzner-websites "cd /data/websites && docker compose logs garage-podbrezsky"
```

### Webhook Not Triggering
1. Check webhook deliveries in GitHub:
   - https://github.com/apodbrezsky/garage-rental-website/settings/hooks
2. Verify webhook server:
   ```bash
   ssh hetzner-websites "docker logs webhook-server | tail -50"
   ```
3. Test webhook manually:
   ```bash
   curl https://webhook.hud.onfire.so
   ```

---

## 📊 Server Specifications

- **Server**: Hetzner Cloud
- **IPv4**: 65.109.160.82
- **IPv6**: 2a01:4f9:c013:851a::/64
- **Domain**: garage.podbrezsky.com
- **SSL**: Automatic via Let's Encrypt (Traefik)
- **Web Server**: Traefik (reverse proxy) → Node.js (Next.js)
- **Container**: garage-podbrezsky-com
- **Port**: 3000 (internal)
- **HTTPS**: Port 443 (external)

---

## 🎯 Next Steps After Deployment

1. **Test Payment Flow**: Make a test booking to verify Stripe integration
2. **Monitor Logs**: Check for any errors in the first few hours
3. **SEO**: Add domain to Google Search Console
4. **Analytics**: Consider adding Google Analytics or similar
5. **Monitoring**: Set up uptime monitoring (e.g., UptimeRobot)
6. **Backup**: Configure automatic backups of environment variables

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Docker logs: `docker logs garage-podbrezsky-com`
3. Verify webhook deliveries in GitHub
4. Check Traefik routing: `docker logs coolify-proxy`

---

**Your deployment infrastructure is ready! Just push to GitHub to go live! 🎉**
