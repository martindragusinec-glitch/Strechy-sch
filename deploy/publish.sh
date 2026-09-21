#!/bin/sh
# Nasazení LP na Cloudflare (Worker fve-strecha-nzulight, účet Cloudflare@schlieger.cz).
# Vyžaduje `npx wrangler login` (OAuth) a deploy/secrets.env (GATEWAY_URL, GATEWAY_KEY, MAKE_WEBHOOK_URL) – ten není v gitu.
# Spouštět z kořene repa: sh deploy/publish.sh
set -e
cd "$(dirname "$0")"
[ -f secrets.env ] || { echo "chybí deploy/secrets.env"; exit 1; }
. ./secrets.env
rm -rf public && mkdir -p public
cp -R ../index.html ../osvc.html ../lp-tracking.js ../lp-consent.js ../assets ../_headers ../_redirects public/
python3 - "$GATEWAY_URL" "$GATEWAY_KEY" "$MAKE_WEBHOOK_URL" <<'PY'
import re,sys
url,key,make=sys.argv[1:4]
for p in ('public/index.html','public/osvc.html'):
  s=open(p,encoding='utf-8').read()
  s,n1=re.subn(r"gateway_url: '[^']*'", "gateway_url: '%s'"%url, s, 1)
  s,n2=re.subn(r"gateway_key: ''", "gateway_key: '%s'"%key, s, 1)
  s,n3=re.subn(r"make_webhook_url: ''", "make_webhook_url: '%s'"%make, s, 1) if make else (s,0)
  assert n1==1 and n2==1, 'nenašel se gateway_url/gateway_key v configu'
  open(p,'w',encoding='utf-8').write(s); print('secrets injected: url=%s key=%s… make=%s'%('PROD' if 'cwertkg' in url else 'DEV', key[:6], 'yes' if make else 'no'))
PY
CLOUDFLARE_ACCOUNT_ID=c8e833267935caf5195bb98bde326ae7 npx -y wrangler@latest deploy
