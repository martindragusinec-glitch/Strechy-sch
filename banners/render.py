#!/usr/bin/env python3
"""Bannery pro Metu (1:1 feed, 9:16 Stories/Reels) z banners/template.html. Spouštět z kořene repa: python3 banners/render.py [senior nizkoprijmove osvc] [--safe]
Výstup: banners/out/sch-fve-<publikum>-<WxH>-<YYYYMM>-v01.png"""
import subprocess, datetime, os, shutil, sys
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; PORT=8766; YM=datetime.date.today().strftime('%Y%m')
AUD=['senior','nizkoprijmove','osvc','broad','pozor','ultrapozor','platba']; FORMATS=['1080x1080','1080x1920']
args=[a for a in sys.argv[1:] if not a.startswith('--')]; safe='--safe' in sys.argv
os.makedirs('banners/out',exist_ok=True)
for a in AUD:
    if args and a not in args: continue
    for f in FORMATS:
        W,H=f.split('x'); out=f'banners/out/sch-fve-{a}-{f}-{YM}-v01{"-safe" if safe else ""}.png'; ud=f'/tmp/cr-banner-{a}-{f}'
        shutil.rmtree(ud,ignore_errors=True)
        try:
            subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',f'--user-data-dir={ud}',f'--window-size={W},{H}',f'--screenshot={out}',f'http://localhost:{PORT}/banners/template.html?a={a}&f={f}{"&safe=1" if safe else ""}'],timeout=14,capture_output=True)
        except subprocess.TimeoutExpired: pass
        print('ok' if os.path.exists(out) else 'FAIL', out); shutil.rmtree(ud,ignore_errors=True)
subprocess.run(['pkill','-f','headless=new'])
