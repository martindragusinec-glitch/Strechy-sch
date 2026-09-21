#!/bin/sh
# Nasazení LP na Cloudflare (Worker fve-strecha-nzulight, účet Cloudflare@schlieger.cz).
# Vyžaduje `npx wrangler login` (OAuth). Spouštět z kořene repa: sh deploy/publish.sh
set -e
cd "$(dirname "$0")"
rm -rf public && mkdir -p public
cp -R ../index.html ../lp-tracking.js ../lp-consent.js ../assets ../_headers ../_redirects public/
CLOUDFLARE_ACCOUNT_ID=c8e833267935caf5195bb98bde326ae7 npx -y wrangler@latest deploy
