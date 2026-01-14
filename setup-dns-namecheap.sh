#!/bin/bash
# Namecheap DNS Setup Script for garage.podbrezsky.com
# Usage: bash setup-dns-namecheap.sh

set -e

# Configuration
API_USER="apodbrezsky"
API_KEY="b4b35b1e98374e4db499ef62971aea1f"
DOMAIN_SLD="podbrezsky"
DOMAIN_TLD="com"
SUBDOMAIN="garage"
SERVER_IPv4="65.109.160.82"
SERVER_IPv6="2a01:4f9:c013:851a::1"

# Get current IP for API authentication
echo "🔍 Detecting your IP address..."
CLIENT_IP=$(curl -s https://api.ipify.org)
echo "   Client IP: $CLIENT_IP"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🌐 Namecheap DNS Configuration"
echo "================================"
echo "Domain: $SUBDOMAIN.$DOMAIN_SLD.$DOMAIN_TLD"
echo "IPv4: $SERVER_IPv4"
echo "IPv6: $SERVER_IPv6"
echo ""

# Function to parse XML response
check_api_response() {
    local response="$1"
    if echo "$response" | grep -q 'Status="ERROR"'; then
        echo -e "${RED}❌ API Error:${NC}"
        echo "$response" | grep -o '<Error[^>]*>.*</Error>' | sed 's/<[^>]*>//g'
        return 1
    elif echo "$response" | grep -q 'Status="OK"'; then
        echo -e "${GREEN}✅ Success${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Unknown response${NC}"
        echo "$response"
        return 1
    fi
}

# Test API connection
echo "🔐 Testing API connection..."
TEST_RESPONSE=$(curl -s "https://api.namecheap.com/xml.response?ApiUser=$API_USER&ApiKey=$API_KEY&UserName=$API_USER&Command=namecheap.domains.getList&ClientIp=$CLIENT_IP&PageSize=1")

if ! check_api_response "$TEST_RESPONSE"; then
    echo ""
    echo -e "${RED}❌ API Access Not Enabled${NC}"
    echo ""
    echo "Please enable API access in Namecheap:"
    echo "1. Go to: https://ap.www.namecheap.com/settings/tools/apiaccess/"
    echo "2. Enable API Access"
    echo "3. Whitelist this IP: $CLIENT_IP"
    echo "4. Also whitelist server IP: $SERVER_IPv4"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo -e "${GREEN}✅ API connection successful${NC}"
echo ""

# Get current DNS records
echo "📋 Fetching existing DNS records..."
CURRENT_DNS=$(curl -s "https://api.namecheap.com/xml.response?ApiUser=$API_USER&ApiKey=$API_KEY&UserName=$API_USER&Command=namecheap.domains.dns.getHosts&ClientIp=$CLIENT_IP&SLD=$DOMAIN_SLD&TLD=$DOMAIN_TLD")

# Save to temp file for processing
echo "$CURRENT_DNS" > /tmp/namecheap_current_dns.xml

# Extract existing records
EXISTING_RECORDS=$(echo "$CURRENT_DNS" | grep -o '<host [^>]*>' | sed 's/[<>]//g')
echo "   Found existing DNS records"

# Build new records list (preserve existing + add new)
RECORD_PARAMS=""
RECORD_NUM=1

# Add existing records (skip if it's our subdomain)
while read -r line; do
    if [ ! -z "$line" ]; then
        HOST_NAME=$(echo "$line" | grep -o 'Name="[^"]*"' | cut -d'"' -f2)
        RECORD_TYPE=$(echo "$line" | grep -o 'Type="[^"]*"' | cut -d'"' -f2)
        ADDRESS=$(echo "$line" | grep -o 'Address="[^"]*"' | cut -d'"' -f2)
        TTL=$(echo "$line" | grep -o 'TTL="[^"]*"' | cut -d'"' -f2)

        # Skip if this is our subdomain (we'll add it fresh)
        if [ "$HOST_NAME" != "$SUBDOMAIN" ]; then
            RECORD_PARAMS="${RECORD_PARAMS}&HostName${RECORD_NUM}=${HOST_NAME}&RecordType${RECORD_NUM}=${RECORD_TYPE}&Address${RECORD_NUM}=${ADDRESS}&TTL${RECORD_NUM}=${TTL}"
            RECORD_NUM=$((RECORD_NUM + 1))
        fi
    fi
done < <(echo "$EXISTING_RECORDS")

# Add A record for subdomain
echo ""
echo "➕ Adding DNS records for $SUBDOMAIN..."
RECORD_PARAMS="${RECORD_PARAMS}&HostName${RECORD_NUM}=${SUBDOMAIN}&RecordType${RECORD_NUM}=A&Address${RECORD_NUM}=${SERVER_IPv4}&TTL${RECORD_NUM}=1800"
RECORD_NUM=$((RECORD_NUM + 1))

# Add AAAA record for subdomain
RECORD_PARAMS="${RECORD_PARAMS}&HostName${RECORD_NUM}=${SUBDOMAIN}&RecordType${RECORD_NUM}=AAAA&Address${RECORD_NUM}=${SERVER_IPv6}&TTL${RECORD_NUM}=1800"

# Apply DNS changes
echo "   A    record: $SUBDOMAIN.$DOMAIN_SLD.$DOMAIN_TLD → $SERVER_IPv4"
echo "   AAAA record: $SUBDOMAIN.$DOMAIN_SLD.$DOMAIN_TLD → $SERVER_IPv6"

UPDATE_RESPONSE=$(curl -s "https://api.namecheap.com/xml.response?ApiUser=$API_USER&ApiKey=$API_KEY&UserName=$API_USER&Command=namecheap.domains.dns.setHosts&ClientIp=$CLIENT_IP&SLD=$DOMAIN_SLD&TLD=$DOMAIN_TLD${RECORD_PARAMS}")

echo ""
if check_api_response "$UPDATE_RESPONSE"; then
    echo ""
    echo -e "${GREEN}✅ DNS Configuration Complete!${NC}"
    echo ""
    echo "🕐 DNS Propagation"
    echo "   Please wait 5-10 minutes for DNS to propagate globally"
    echo ""
    echo "🔍 Verify DNS:"
    echo "   dig $SUBDOMAIN.$DOMAIN_SLD.$DOMAIN_TLD A +short"
    echo "   dig $SUBDOMAIN.$DOMAIN_SLD.$DOMAIN_TLD AAAA +short"
    echo ""
    echo "   Expected results:"
    echo "   - A record: $SERVER_IPv4"
    echo "   - AAAA record: $SERVER_IPv6"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Wait for DNS propagation (5-10 min)"
    echo "   2. Push code to GitHub: git push -u origin main"
    echo "   3. Deploy: ssh hetzner-websites \"bash /data/websites/garage.podbrezsky.com/deploy.sh\""
    echo "   4. Visit: https://$SUBDOMAIN.$DOMAIN_SLD.$DOMAIN_TLD"
    echo ""
else
    echo ""
    echo -e "${RED}❌ DNS Update Failed${NC}"
    echo ""
    echo "Please check the error above or configure DNS manually:"
    echo "https://ap.www.namecheap.com/domains/domaincontrolpanel/$DOMAIN_SLD.$DOMAIN_TLD/advancedns"
    exit 1
fi
