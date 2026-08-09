#!/bin/bash
# ============================================================
#  ENGULFIC — First Time VPS Setup Script
#  Run: bash setup.sh
# ============================================================

set -e

VPS_DIR="/plexivia/engulficDev"
REPO_URL="https://github.com/ikram3031/Engulfic.git"
BRANCH="dev"

echo "==> Creating directory..."
mkdir -p $VPS_DIR
cd $VPS_DIR

echo "==> Cloning repo..."
git clone -b $BRANCH $REPO_URL .

echo "==> Creating uploads directory..."
mkdir -p /engulf/uploads

echo "==> Installing nginx..."
apt-get update -qq
apt-get install -y nginx certbot python3-certbot-nginx

echo "==> Setting up nginx..."
cp nginx.conf /etc/nginx/sites-available/engulfic
ln -sf /etc/nginx/sites-available/engulfic /etc/nginx/sites-enabled/engulfic
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo ""
echo "==> DONE! Now:"
echo "    1. Create .env file: cp /dev/null .env && nano .env"
echo "    2. Run: make rebuild"
echo "    3. SSL: certbot --nginx -d engulfic.com -d www.engulfic.com -d server.engulfic.com"
