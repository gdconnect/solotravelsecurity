#!/usr/bin/env bash
# ==============================================================================
# Solo Travel Security - Local Development Setup & Server Launcher
# ==============================================================================
# Usage:
#   ./scripts/dev-local.sh        (standard user)
#   sudo ./scripts/dev-local.sh   (with root privileges if updating /etc/hosts)
# ==============================================================================

set -e

PROJECT_DIR="/var/www/html/solotravelsecurity"
PORT="3020"
DOMAIN="solotravelsecurity.localhost"
CADDYFILE="/etc/caddy/Caddyfile"

CYAN="\033[1;36m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
RESET="\033[0m"

echo -e "${CYAN}🛡️  Solo Travel Security — Local Dev Launcher${RESET}"
echo -e "${CYAN}==================================================${RESET}"

cd "$PROJECT_DIR"

# 1. Check /etc/hosts entry
if grep -q "$DOMAIN" /etc/hosts 2>/dev/null; then
  echo -e "${GREEN}✓${RESET} /etc/hosts already contains $DOMAIN"
else
  echo -e "${YELLOW}!${RESET} $DOMAIN not explicitly listed in /etc/hosts."
  if [ "$EUID" -eq 0 ]; then
    echo "127.0.0.1 $DOMAIN" >> /etc/hosts
    echo -e "${GREEN}✓${RESET} Added '127.0.0.1 $DOMAIN' to /etc/hosts"
  else
    echo -e "  (Note: Run with sudo if you want to add it to /etc/hosts explicitly, though systemd-resolved resolves *.localhost automatically)"
  fi
fi

# 2. Check Caddy configuration
if [ -f "$CADDYFILE" ]; then
  if grep -q "$DOMAIN" "$CADDYFILE"; then
    echo -e "${GREEN}✓${RESET} Caddyfile contains $DOMAIN"
    echo -e "  Reloading Caddy..."
    caddy reload --config "$CADDYFILE" 2>/dev/null || true
    echo -e "${GREEN}✓${RESET} Caddy reloaded"
  else
    echo -e "${RED}✗${RESET} $DOMAIN block not found in $CADDYFILE"
  fi
fi

# 3. Clean up any stale process on port 3020 if needed
STALE_PID=$(ss -tulpn 2>/dev/null | grep ":$PORT " | grep -o 'pid=[0-9]*' | cut -d= -f2 | head -n 1 || true)
if [ -n "$STALE_PID" ]; then
  echo -e "${YELLOW}!${RESET} Port $PORT is currently occupied by PID $STALE_PID."
  read -p "  Do you want to terminate PID $STALE_PID and restart dev server? [Y/n] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
    kill -9 "$STALE_PID" 2>/dev/null || sudo kill -9 "$STALE_PID" 2>/dev/null || true
    echo -e "${GREEN}✓${RESET} Port $PORT freed."
    sleep 1
  fi
fi

echo -e "\n${CYAN}Starting Next.js dev server on port $PORT...${RESET}"
echo -e "Available at:"
echo -e "  ${GREEN}► Local HTTPS:${RESET}  https://${DOMAIN}/"
echo -e "  ${GREEN}► Direct Port:${RESET}  http://localhost:${PORT}/"
echo -e "  ${GREEN}► Sample pSEO:${RESET}  https://${DOMAIN}/playbook/solo-female/rome/night-arrival-transit/"
echo -e "  ${GREEN}► Sample Report:${RESET} https://${DOMAIN}/report/rome/\n"

# Run as normal user if script was run with sudo
if [ -n "$SUDO_USER" ]; then
  exec su - "$SUDO_USER" -c "cd '$PROJECT_DIR' && npm run dev"
else
  exec npm run dev
fi
