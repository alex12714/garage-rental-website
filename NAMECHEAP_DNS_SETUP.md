# 🌐 Namecheap DNS Setup for garage.podbrezsky.com

## ⚠️ API Access Not Enabled

Your Namecheap API returned an error:
```
Error 1011102: API Key is invalid or API access has not been enabled
```

You have **two options** to configure DNS:

---

## Option 1: Manual DNS Setup (Fastest - 5 minutes)

### Step 1: Enable API Access (for future automation)

1. Log in to Namecheap: https://ap.www.namecheap.com/
2. Go to **Profile** → **Tools** → **API Access**
3. Enable API Access
4. Whitelist these IPs:
   - `5.161.180.94` (your current IP)
   - `65.109.160.82` (server IP)

### Step 2: Configure DNS Records Manually

1. Go to Namecheap Dashboard: https://ap.www.namecheap.com/domains/list/
2. Find **podbrezsky.com** and click **Manage**
3. Go to **Advanced DNS** tab
4. Add these DNS records:

| Type  | Host   | Value              | TTL       |
|-------|--------|--------------------|-----------|
| A     | garage | 65.109.160.82      | Automatic |
| AAAA  | garage | 2a01:4f9:c013:851a::1 | Automatic |

**Click "Save All Changes"**

### Step 3: Verify DNS Propagation

Wait 5-10 minutes, then test:
```bash
# Check A record
dig garage.podbrezsky.com A +short

# Check AAAA record
dig garage.podbrezsky.com AAAA +short

# Should return:
# 65.109.160.82
# 2a01:4f9:c013:851a::1
```

### Step 4: Deploy Website

Once DNS is configured:
```bash
# Push code to GitHub
git push -u origin main

# Trigger first deployment
ssh hetzner-websites "bash /data/websites/garage.podbrezsky.com/deploy.sh"

# Wait 2-3 minutes for SSL certificate generation
```

### Step 5: Verify SSL Certificate

Wait 2-3 minutes after deployment, then visit:
```
https://garage.podbrezsky.com
```

Traefik will automatically request and configure Let's Encrypt SSL certificate.

---

## Option 2: Automated API Setup (After enabling API)

Once you've enabled API access and whitelisted IPs, use this script:

### Automated DNS Configuration Script

```bash
#!/bin/bash

API_USER="apodbrezsky"
API_KEY="b4b35b1e98374e4db499ef62971aea1f"
DOMAIN="podbrezsky.com"
SUBDOMAIN="garage"
SERVER_IPv4="65.109.160.82"
SERVER_IPv6="2a01:4f9:c013:851a::1"

# Get current IP for API authentication
CLIENT_IP=$(curl -s https://api.ipify.org)

echo "Setting up DNS for $SUBDOMAIN.$DOMAIN..."
echo "Client IP: $CLIENT_IP"

# Get existing DNS records
echo "Fetching existing DNS records..."
EXISTING_RECORDS=$(curl -s "https://api.namecheap.com/xml.response?ApiUser=$API_USER&ApiKey=$API_KEY&UserName=$API_USER&Command=namecheap.domains.dns.getHosts&ClientIp=$CLIENT_IP&SLD=podbrezsky&TLD=com")

# Add A record
echo "Adding A record for $SUBDOMAIN..."
curl -s "https://api.namecheap.com/xml.response?ApiUser=$API_USER&ApiKey=$API_KEY&UserName=$API_USER&Command=namecheap.domains.dns.setHosts&ClientIp=$CLIENT_IP&SLD=podbrezsky&TLD=com&HostName1=$SUBDOMAIN&RecordType1=A&Address1=$SERVER_IPv4&TTL1=1800"

# Add AAAA record
echo "Adding AAAA record for $SUBDOMAIN..."
curl -s "https://api.namecheap.com/xml.response?ApiUser=$API_USER&ApiKey=$API_KEY&UserName=$API_USER&Command=namecheap.domains.dns.setHosts&ClientIp=$CLIENT_IP&SLD=podbrezsky&TLD=com&HostName2=$SUBDOMAIN&RecordType2=AAAA&Address2=$SERVER_IPv6&TTL2=1800"

echo "DNS configuration complete!"
echo "Wait 5-10 minutes for DNS propagation"
echo ""
echo "Test with:"
echo "  dig garage.podbrezsky.com A +short"
echo "  dig garage.podbrezsky.com AAAA +short"
```

**Save as:** `setup-dns.sh` and run: `bash setup-dns.sh`

---

## 🔒 SSL Certificate (Automatic)

### How It Works

1. **Traefik** (reverse proxy on your server) is configured with Let's Encrypt
2. When you visit `https://garage.podbrezsky.com` for the first time:
   - Traefik detects the HTTPS request
   - Requests SSL certificate from Let's Encrypt
   - Validates domain ownership via HTTP-01 challenge
   - Installs certificate automatically
3. Certificate auto-renews before expiration

### Traefik Configuration (Already Set Up)

Your docker-compose.yml includes:
```yaml
labels:
  - traefik.http.routers.garage-https.tls=true
  - traefik.http.routers.garage-https.tls.certresolver=letsencrypt
```

### Verify SSL After Deployment

```bash
# Check SSL certificate
curl -vI https://garage.podbrezsky.com 2>&1 | grep -E '(subject|issuer|expire)'

# Or use online tool
# https://www.ssllabs.com/ssltest/analyze.html?d=garage.podbrezsky.com
```

### Troubleshoot SSL Issues

If SSL doesn't work after 5 minutes:

```bash
# Check Traefik logs
ssh hetzner-websites "docker logs coolify-proxy | grep -i 'garage\|letsencrypt' | tail -50"

# Check if container is running
ssh hetzner-websites "docker ps | grep garage"

# Restart Traefik
ssh hetzner-websites "docker restart coolify-proxy"

# Check DNS is resolving
dig garage.podbrezsky.com +short
```

---

## 📋 Complete Deployment Checklist

- [ ] **Enable Namecheap API Access** (Profile → Tools → API Access)
- [ ] **Whitelist IPs** (5.161.180.94, 65.109.160.82)
- [ ] **Add DNS Records** (A: 65.109.160.82, AAAA: 2a01:4f9:c013:851a::1)
- [ ] **Verify DNS** (`dig garage.podbrezsky.com`)
- [ ] **Push to GitHub** (`git push -u origin main`)
- [ ] **Configure GitHub Webhook** (https://webhook.hud.onfire.so)
- [ ] **Deploy Website** (`ssh hetzner-websites "bash /data/websites/garage.podbrezsky.com/deploy.sh"`)
- [ ] **Wait for SSL** (2-3 minutes)
- [ ] **Test Website** (https://garage.podbrezsky.com)
- [ ] **Test Booking** (Make a test reservation)
- [ ] **Verify Email/SMS** (Check Make.com webhook)

---

## 🚀 Quick Start (Manual DNS - Recommended Now)

```bash
# 1. Manually add DNS records in Namecheap dashboard
#    (See Step 2 above)

# 2. Wait 5 minutes, then verify DNS
dig garage.podbrezsky.com +short

# 3. Push to GitHub (you may need to authenticate first)
gh auth login  # Or use personal access token
git push -u origin main

# 4. Deploy
ssh hetzner-websites "bash /data/websites/garage.podbrezsky.com/deploy.sh"

# 5. Wait 2-3 minutes, then visit
open https://garage.podbrezsky.com
```

---

## 🔍 DNS Propagation Status

Check DNS propagation globally:
- https://dnschecker.org/#A/garage.podbrezsky.com
- https://www.whatsmydns.net/#A/garage.podbrezsky.com

---

## 📞 Troubleshooting

### DNS Not Resolving
- Wait 5-10 minutes for propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)
- Try: `dig @8.8.8.8 garage.podbrezsky.com` (Google DNS)

### SSL Certificate Not Working
- Ensure DNS is fully propagated first
- Check Traefik logs (see commands above)
- Verify port 80 and 443 are accessible
- Try restarting Traefik proxy

### Website Not Loading
- Check container status: `docker ps | grep garage`
- View logs: `docker logs garage-podbrezsky-com`
- Verify environment variables are loaded
- Check if build completed successfully

---

## 📊 Expected Timeline

| Step | Time |
|------|------|
| Manual DNS setup | 5 minutes |
| DNS propagation | 5-10 minutes |
| Push to GitHub | 1 minute |
| GitHub webhook setup | 2 minutes |
| Initial deployment | 3-5 minutes |
| SSL certificate generation | 2-3 minutes |
| **Total** | **~20 minutes** |

---

**Recommendation:** Use **Manual DNS Setup** now (fastest). You can enable API later for automated updates.

Start here: https://ap.www.namecheap.com/domains/domaincontrolpanel/podbrezsky.com/advancedns
