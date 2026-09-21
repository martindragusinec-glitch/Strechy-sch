#!/usr/bin/env python3
"""Vyrenderuje bannery z banners/template.html přes headless Chrome. Spouštět z kořene repa: python3 banners/render.py
Výstup: banners/out/sch-fve-<publikum>-<WxH>-<YYYYMM>-v<NN>.png (konvence marketing-playbook)."""
import subprocess, datetime, os, shutil, sys
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; PORT=8766; YM=datetime.date.today().strftime('%Y%m')
CONCEPTS={'a':('b2c','01'),'b':('b2c','02'),'c':('senior','03'),'d':('b2c','04')}
FORMATS=['1080x1350','1080x1080','1080x1920','1200x628']
only=sys.argv[1:]  # volitelně: koncepty k renderu, např. a c
os.makedirs('banners/out',exist_ok=True)
for c,(pub,v) in CONCEPTS.items():
    if only and c not in only: continue
    for f in FORMATS:
        W,H=f.split('x'); out=f'banners/out/sch-fve-{pub}-{f}-{YM}-v{v}.png'; ud=f'/tmp/cr-banner-{c}-{f}'
        shutil.rmtree(ud,ignore_errors=True)
        try:
            subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',f'--user-data-dir={ud}',f'--window-size={W},{H}',f'--screenshot={out}',f'http://localhost:{PORT}/banners/template.html?c={c}&f={f}'],timeout=14,capture_output=True)
            print('ok',out)
        except subprocess.TimeoutExpired:
            print('TIMEOUT',out)
        shutil.rmtree(ud,ignore_errors=True)
