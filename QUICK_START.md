# 🚀 Quick Start - Deploy garage.podbrezsky.com in 20 Minutes

## Current Status

✅ **Server Infrastructure**: Fully configured (Hetzner - 65.109.160.82)
✅ **Docker & Traefik**: Ready with automatic SSL
✅ **Environment Variables**: Uploaded securely
✅ **Webhook System**: Configured for auto-deployment
✅ **Application Code**: 5 commits, 10,800+ lines, ready to deploy

⏳ **Remaining**: DNS configuration + GitHub push

---

## ⚡ Fast Track (Manual DNS - Recommended)

### Step 1: Configure DNS in Namecheap (5 minutes)

1. **Go to Namecheap Dashboard**
   - URL: https://ap.www.namecheap.com/domains/domaincontrolpanel/podbrezsky.com/advancedns

2. **Add DNS Records**

   Click "ADD NEW RECORD" twice and add:

   **Record 1 (IPv4):**
   - Type: `A Record`
   - Host: `garage`
   - Value: `65.109.160.82`
   - TTL: `Automatic`

   **Record 2 (IPv6):**
   - Type: `AAAA Record`
   - Host: `garage`
   - Value: `2a01:4f9:c013:851a::1`
   - TTL: `Automatic`

3. **Save All Changes** (green checkmark button)

4. **Wait 5-10 minutes** for DNS propagation

---

### Step 2: Verify DNS (1 minute)

After 5-10 minutes, test DNS:

```bash
dig garage.podbrezsky.com +short
```

**Expected output:**
```
65.109.160.82
```

If you see the IP, DNS is ready! If not, wait a few more minutes.

---

### Step 3: Push to GitHub (2 minutes)

#### Option A: Using GitHub CLI (Easiest)
```bash
gh auth login
git push -u origin main
```

#### Option B: Using Personal Access Token
1. Create token: https://github.com/settings/tokens/new
   - Note: "Garage Website Deploy"
   - Expiration: 90 days
   - Scope: ✅ `repo` (all)
2. Copy the token
3. Push:
```bash
git push -u origin main
# Username: apodbrezsky
# Password: [paste your token]
```

---

### Step 4: Configure GitHub Webhook (2 minutes)

1. **Go to repository webhook settings:**
   - URL: https://github.com/apodbrezsky/garage-rental-website/settings/hooks

2. **Click "Add webhook"**

3. **Configure:**
   - **Payload URL**: `https://webhook.hud.onfire.so`
   - **Content type**: `application/json`
   - **Secret**: `19b5c5727fd3cb7474607f433d1060d45155220fd2cae77ac180a8759962b1be`
   - **Which events?**: ✅ Just the push event
   - **Active**: ✅ Checked

4. **Click "Add webhook"**

---

### Step 5: Deploy Website (5 minutes)

```bash
ssh hetzner-websites "bash /data/websites/garage.podbrezsky.com/deploy.sh"
```

**What happens:**
- ⬇️ Clones code from GitHub
- 🔨 Builds Next.js application in Docker
- 🚀 Starts container
- 🔒 Traefik requests SSL certificate from Let's Encrypt
- ✅ Website goes live

**Wait 2-3 minutes for SSL certificate generation**

---

### Step 6: Visit Your Website! 🎉

```bash
open https://garage.podbrezsky.com
```

Or visit: **https://garage.podbrezsky.com**

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Website loads at https://garage.podbrezsky.com
- [ ] SSL certificate is valid (🔒 green padlock in browser)
- [ ] All 12 sections display correctly
- [ ] Language switcher works (LV/EN/RU)
- [ ] Google Maps shows correct location
- [ ] Pricing calculator works
- [ ] Booking form loads
- [ ] Terms & Conditions page works: https://garage.podbrezsky.com/terms
- [ ] Test booking flow (use Stripe test mode if needed)

---

## 🔄 Future Updates (Automatic)

After initial setup, updates are automatic:

```bash
# Make changes to your code
git add .
git commit -m "Update pricing"
git push

# GitHub webhook triggers automatically
# Website updates in ~1-2 minutes
# No manual deployment needed!
```

---

## 🛠️ Useful Commands

**View deployment logs:**
```bash
ssh hetzner-websites "docker logs -f garage-podbrezsky-com"
```

**Restart website:**
```bash
ssh hetzner-websites "cd /data/websites && docker compose restart garage-podbrezsky"
```

**Check SSL certificate:**
```bash
curl -vI https://garage.podbrezsky.com 2>&1 | grep -i 'subject\|issuer'
```

**Check container status:**
```bash
ssh hetzner-websites "docker ps | grep garage"
```

---

## 🆘 Troubleshooting

### DNS not resolving?
- Wait 10 more minutes (can take up to 1 hour in rare cases)
- Check globally: https://dnschecker.org/#A/garage.podbrezsky.com
- Clear local cache: `sudo dscacheutil -flushcache` (Mac)

### SSL certificate error?
- Wait 5 more minutes (Let's Encrypt validation takes time)
- Check Traefik logs: `ssh hetzner-websites "docker logs coolify-proxy | grep garage"`
- Verify DNS is fully propagated first

### Website not loading?
- Check container: `ssh hetzner-websites "docker ps | grep garage"`
- View logs: `ssh hetzner-websites "docker logs garage-podbrezsky-com"`
- Restart: `ssh hetzner-websites "cd /data/websites && docker compose restart garage-podbrezsky"`

### Webhook not triggering?
- Check webhook deliveries in GitHub settings
- Verify webhook server: `ssh hetzner-websites "docker logs webhook-server | tail -20"`
- Test URL: `curl https://webhook.hud.onfire.so`

---

## 📚 Detailed Documentation

- **DEPLOYMENT.md** - Complete deployment guide with troubleshooting
- **NAMECHEAP_DNS_SETUP.md** - DNS configuration options (manual + API)
- **SERVER_SETUP_COMPLETE.md** - Infrastructure status
- **setup-dns-namecheap.sh** - Automated DNS setup script (for later)

---

## ⏱️ Timeline

| Step | Time | Status |
|------|------|--------|
| DNS configuration | 5 min | ⏳ To do |
| DNS propagation | 5-10 min | ⏳ Waiting |
| GitHub push | 2 min | ⏳ To do |
| Webhook setup | 2 min | ⏳ To do |
| Initial deployment | 5 min | ⏳ To do |
| SSL generation | 2-3 min | ⏳ Waiting |
| **Total** | **~20 min** | |

---

## 🎯 Start Here

**👉 Step 1:** Configure DNS at https://ap.www.namecheap.com/domains/domaincontrolpanel/podbrezsky.com/advancedns

Add these two records:
- A Record: `garage` → `65.109.160.82`
- AAAA Record: `garage` → `2a01:4f9:c013:851a::1`

Then follow steps 2-6 above!

---

**Need help?** All files are committed and ready. Your server is configured. Just complete DNS + GitHub push! 🚀
