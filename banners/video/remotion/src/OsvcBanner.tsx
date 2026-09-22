import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/* Animovaný Meta banner OSVČ: hook → mýtus → kalkulačka dojde k nároku → cena + CTA. Bez zvuku, 10 s, smyčka. */
export type Fmt = 'story' | 'square';
export const BANNER_FRAMES = 450;
/* VO (Holden, ElevenLabs): b1 4.28 s, b2 3.32 s, b3 4.13 s, b4 1.96 s */
const VO = [{f: 'audio/b1.mp3', at: 9}, {f: 'audio/b2.mp3', at: 146}, {f: 'audio/b3.mp3', at: 254}, {f: 'audio/b4.mp3', at: 386}];
const INK = '#1B2028', INK3 = '#646B74', PAPER = '#F6F5F1', LINE = 'rgba(27,32,40,.18)', GREEN = '#24A531', GREEN_D = '#1B7C25', GREEN_S = '#E7F5E9', RED = '#DA000F', YEL = '#FFD23F';
const font = ['700', '600', '500', '400'].map((w) => `@font-face{font-family:P;src:url(${staticFile(`fonts/poppins-${w}-latin-ext.woff2`)}) format("woff2");font-weight:${w};unicode-range:U+0100-024F,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF}@font-face{font-family:P;src:url(${staticFile(`fonts/poppins-${w}-latin.woff2`)}) format("woff2");font-weight:${w}}`).join('');
const K = (n: number) => Math.round(n).toLocaleString('cs-CZ') + ' Kč';
const clamp = (f: number, a: number, b: number, c: number, d: number, e?: (t: number) => number) => interpolate(f, [a, b], [c, d], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const useS = (from: number, cfg = {damping: 14, stiffness: 160}) => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return spring({frame: f - from, fps, config: cfg}); };

/* ── fáze A: hook + razítko ─────────────────────────────── */
const Hook: React.FC<{s: number; from: number; to: number}> = ({s, from, to}) => {
  const f = useCurrentFrame(); const p = useS(from, {damping: 16, stiffness: 140}); const st = useS(from + 112, {damping: 9, stiffness: 320});
  const out = clamp(f, to - 10, to, 1, 0);
  const shake = f > from + 112 && f < from + 120 ? Math.sin((f - from) * 9) * 6 : 0;
  return (<div style={{opacity: Math.min(p, out), transform: `translate(${shake}px, ${(1 - p) * 30}px)`, textAlign: 'center', color: '#fff', position: 'relative', paddingBottom: 130 * s}}>
    <div style={{fontSize: 32 * s, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.75)', marginBottom: 18 * s}}>Živnostníci, pozor</div>
    <div style={{fontSize: 84 * s, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-.03em', textShadow: '0 6px 30px rgba(0,0,0,.55)'}}>Myslíte, že jako OSVČ na dotaci <span style={{whiteSpace: 'nowrap'}}>nedosáhnete?</span></div>
    <div style={{position: 'absolute', left: '50%', bottom: 0, transform: `translate(-50%,10%) rotate(-9deg) scale(${0.4 + 0.6 * st})`, opacity: st, border: `${8 * s}px solid ${RED}`, color: RED, fontSize: 118 * s, fontWeight: 700, letterSpacing: '.04em', padding: `${4 * s}px ${28 * s}px`, borderRadius: 18 * s, background: 'rgba(255,255,255,.92)', boxShadow: '0 30px 60px -20px rgba(0,0,0,.7)', mixBlendMode: 'normal'}}>OMYL.</div>
  </div>);
};

/* ── fáze B: mýtus vs. realita ──────────────────────────── */
const Myth: React.FC<{s: number; from: number; to: number}> = ({s, from, to}) => {
  const f = useCurrentFrame(); const p = useS(from, {damping: 16, stiffness: 140}); const a = useS(from + 14, {damping: 12, stiffness: 200}); const b = useS(from + 30, {damping: 12, stiffness: 200}); const line = clamp(f, from + 24, from + 40, 0, 100);
  const out = clamp(f, to - 10, to, 1, 0);
  const Row: React.FC<{ok: boolean; t: string; k: number}> = ({ok, t, k}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 22 * s, background: '#fff', borderRadius: 22 * s, padding: `${20 * s}px ${28 * s}px`, opacity: k, transform: `translateX(${(1 - k) * (ok ? 40 : -40)}px)`, border: `3px solid ${ok ? GREEN : LINE}`, position: 'relative'}}>
      <span style={{width: 56 * s, height: 56 * s, borderRadius: '50%', background: ok ? GREEN : RED, display: 'grid', placeItems: 'center', flex: 'none'}}>
        {ok ? <svg width={30 * s} height={30 * s} viewBox="0 0 15 15" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8l3.2 3.2L12.5 4" /></svg> : <svg width={26 * s} height={26 * s} viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M2.5 2.5l9 9M11.5 2.5l-9 9" /></svg>}
      </span>
      <span style={{fontSize: 40 * s, fontWeight: 600, color: ok ? INK : INK3, position: 'relative', display: 'inline-block'}}>{t}{!ok && <span style={{position: 'absolute', left: 0, top: '52%', height: 5 * s, width: `${line}%`, background: RED, borderRadius: 3}} />}</span>
    </div>);
  return (<div style={{opacity: Math.min(p, out), transform: `translateY(${(1 - p) * 30}px)`, color: '#fff', textAlign: 'center'}}>
    <div style={{fontSize: 64 * s, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-.025em', marginBottom: 34 * s, textShadow: '0 6px 30px rgba(0,0,0,.55)'}}>Kdo má nárok na dotaci?</div>
    <div style={{display: 'grid', gap: 16 * s, textAlign: 'left'}}><Row ok={false} t="Podle toho, jestli máte živnost" k={a} /><Row ok t="Podle příjmu domácnosti" k={b} /></div>
  </div>);
};

/* ── fáze C: kalkulačka ─────────────────────────────────── */
const Cursor: React.FC<{x: number; y: number; show: number; clickAt: number; s: number}> = ({x, y, show, clickAt, s}) => {
  const f = useCurrentFrame(); const r = clamp(f, clickAt, clickAt + 12, 0.5, 1.7); const ro = clamp(f, clickAt, clickAt + 12, 0.9, 0);
  return (<div style={{position: 'absolute', left: x, top: y, width: 30 * s, height: 30 * s, opacity: show, transition: 'none', zIndex: 5}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: RED, boxShadow: '0 0 0 4px #fff, 0 10px 24px rgba(0,0,0,.4)'}} />
    <div style={{position: 'absolute', inset: -10 * s, borderRadius: '50%', border: `3px solid ${RED}`, opacity: ro, transform: `scale(${r})`}} />
  </div>);
};

const Calc: React.FC<{s: number; from: number; W: number}> = ({s, from, W}) => {
  const f = useCurrentFrame(); const t = f - from;
  const p = useS(from, {damping: 16, stiffness: 130});
  const pad = 36 * s, inner = W - pad * 2;
  /* kroky: 0–30 chips, 30–70 slider, 70–120 výsledek */
  const chipOn = t >= 22; const chipK = useS(from + 22, {damping: 9, stiffness: 300});
  const sl = clamp(t, 42, 70, 500000, 800000, ease); const pct = sl / 3000000;
  const zisk = sl * 0.3, net = Math.max(0, (zisk - Math.max(0, zisk * 0.15 - 30840) - Math.max(68640, zisk * 0.55 * 0.292) - Math.max(39672, zisk * 0.5 * 0.135)) / 12);
  const step = t < 34 ? 0 : t < 78 ? 1 : 2;
  const paneK = useS(from + (step === 1 ? 34 : step === 2 ? 78 : 0), {damping: 16, stiffness: 160});
  const inc = clamp(t, 86, 116, 0, 10544, ease); const markPct = clamp(t, 86, 116, 0.96, 0.26, ease);
  const v = useS(from + 118, {damping: 10, stiffness: 200}); const vc = useS(from + 124, {damping: 8, stiffness: 260});
  /* kurzor: chip (x≈ první chip) → slider → mizí */
  const chipX = pad + inner * 0.06, chipY = 178 * s; const thumbX = pad + inner * pct - 8 * s, thumbY = 236 * s;
  const cx = step === 0 ? chipX : thumbX, cy = step === 0 ? chipY : thumbY; const show = t > 8 && t < 76 ? 1 : 0;
  return (<div style={{opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.96 + 0.04 * p})`, width: W, background: PAPER, borderRadius: 30 * s, padding: `${26 * s}px ${pad}px ${30 * s}px`, color: INK, boxShadow: '0 40px 90px -30px rgba(0,0,0,.8)', position: 'relative'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20 * s, letterSpacing: '.12em', textTransform: 'uppercase', color: INK3, fontWeight: 600, borderBottom: `1px solid ${LINE}`, paddingBottom: 16 * s}}>
      <span>Kalkulačka nároku</span><span style={{display: 'flex', gap: 6}}>{[0, 1, 2].map((i) => <i key={i} style={{width: 34 * s, height: 6, borderRadius: 3, background: i <= step ? RED : '#EEECE6'}} />)}</span>
    </div>
    <div style={{position: 'relative', height: 330 * s, marginTop: 14 * s, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: paneK, transform: `translateX(${(1 - paneK) * 40}px)`}}>
        {step === 0 && (<>
          <Q n={1} t="Kdo u vás doma bydlí?" s={s} />
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 * s}}>
            <Chips s={s} label="Dospělí a děti od 14" items={['1', '2', '3', '4+']} sel={0} k={chipOn ? chipK : 0} />
            <Chips s={s} label="Děti do 13 let" items={['0', '1', '2', '3+']} sel={0} k={chipOn ? chipK : 0} />
          </div>
        </>)}
        {step === 1 && (<>
          <Q n={2} t="Kolik ročně vyfakturujete?" s={s} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 24 * s, fontWeight: 600}}><span>Roční fakturace</span><b style={{fontSize: 46 * s, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums'}}>{K(sl)}</b></div>
          <div style={{position: 'relative', height: 56 * s, marginTop: 10 * s}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 24 * s, height: 10 * s, borderRadius: 5, background: '#EEECE6'}} />
            <div style={{position: 'absolute', left: 0, width: `${pct * 100}%`, top: 24 * s, height: 10 * s, borderRadius: 5, background: GREEN}} />
            <div style={{position: 'absolute', left: `calc(${pct * 100}% - ${22 * s}px)`, top: 7 * s, width: 44 * s, height: 44 * s, borderRadius: '50%', background: '#fff', border: `3px solid ${INK}`, boxShadow: '0 8px 20px rgba(27,32,40,.3)'}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 18 * s, color: INK3}}><span>0 Kč</span><span>výdaje paušálně 70 %</span><span>3 mil. Kč</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 26 * s, paddingTop: 16 * s, borderTop: `2px dashed ${LINE}`, fontSize: 22 * s, color: INK3}}><span>Čistý příjem z podnikání</span><b style={{fontSize: 30 * s, color: GREEN_D, fontVariantNumeric: 'tabular-nums'}}>≈ {K(net)} / měs.</b></div>
        </>)}
        {step === 2 && (<>
          <Q n={3} t="Váš výsledek" s={s} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 22 * s, fontWeight: 600}}><span>Příjem domácnosti na osobu</span><b style={{fontSize: 44 * s, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums'}}>{K(inc)}</b></div>
          <div style={{position: 'relative', height: 20 * s, borderRadius: 10, background: '#EEECE6', margin: `${40 * s}px 0 ${12 * s}px`}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: '66%', borderRadius: '10px 0 0 10px', background: GREEN_S, borderRight: `3px solid ${GREEN}`}} />
            <div style={{position: 'absolute', left: '66%', top: -30 * s, transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: 18 * s, color: GREEN_D, fontWeight: 600}}>hranice 25 426 Kč</div>
            <div style={{position: 'absolute', top: -12 * s, left: `calc(${markPct * 100}% - ${22 * s}px)`, width: 44 * s, height: 44 * s, borderRadius: '50%', background: '#fff', border: `3px solid ${markPct < 0.66 ? GREEN : INK}`, boxShadow: '0 8px 20px rgba(27,32,40,.3)'}} />
          </div>
          <div style={{opacity: v, transform: `scale(${0.92 + 0.08 * v})`, background: GREEN_S, borderRadius: 20 * s, padding: `${18 * s}px ${22 * s}px`, marginTop: 18 * s, display: 'flex', gap: 18 * s, alignItems: 'center'}}>
            <span style={{width: 50 * s, height: 50 * s, borderRadius: '50%', background: GREEN, display: 'grid', placeItems: 'center', flex: 'none', transform: `scale(${vc})`}}><svg width={26 * s} height={26 * s} viewBox="0 0 15 15" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8l3.2 3.2L12.5 4" /></svg></span>
            <div><b style={{display: 'block', fontSize: 34 * s, color: GREEN_D, letterSpacing: '-.01em', lineHeight: 1.1}}>Pravděpodobně máte nárok</b><span style={{fontSize: 21 * s, color: '#383F47'}}>na dotaci <b style={{color: INK}}>až 320 000 Kč</b> předem na účet</span></div>
          </div>
        </>)}
      </div>
    </div>
    <Cursor x={cx} y={cy} show={show} clickAt={from + (step === 0 ? 22 : 42)} s={s} />
  </div>);
};
const Q: React.FC<{n: number; t: string; s: number}> = ({n, t, s}) => (<div style={{display: 'flex', alignItems: 'center', gap: 14 * s, fontWeight: 600, fontSize: 30 * s, color: INK, margin: `${6 * s}px 0 ${18 * s}px`}}><b style={{width: 40 * s, height: 40 * s, borderRadius: '50%', background: INK, color: '#fff', fontSize: 18 * s, display: 'grid', placeItems: 'center'}}>{n}</b>{t}</div>);
const Chips: React.FC<{s: number; label: string; items: string[]; sel: number; k: number}> = ({s, label, items, sel, k}) => (<div><div style={{fontSize: 19 * s, color: INK3, marginBottom: 8 * s}}>{label}</div><div style={{display: 'grid', gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 8 * s}}>{items.map((it, i) => { const on = i === sel; return <div key={i} style={{height: 62 * s, borderRadius: 14 * s, border: `2px solid ${on && k > 0.3 ? INK : LINE}`, background: on ? `rgba(27,32,40,${k})` : '#fff', color: on && k > 0.5 ? '#fff' : INK, display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 24 * s, transform: `scale(${on ? 1 + 0.06 * Math.sin(k * Math.PI) : 1})`}}>{it}</div>; })}</div></div>);

/* ── nálepka, cena, CTA ─────────────────────────────────── */
const Sticker: React.FC<{s: number; from: number; style?: React.CSSProperties}> = ({s, from, style}) => { const p = useS(from, {damping: 8, stiffness: 240}); return (<div style={{position: 'absolute', opacity: p, transform: `rotate(${-18 + 12 * p}deg) scale(${0.4 + 0.6 * p})`, background: YEL, color: INK, fontWeight: 600, fontSize: 24 * s, lineHeight: 1.05, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '.02em', padding: `${16 * s}px ${24 * s}px`, borderRadius: 18 * s, boxShadow: '0 24px 50px -14px rgba(0,0,0,.8)', zIndex: 6, ...style}}>Dotace předem<b style={{display: 'block', fontSize: 52 * s, letterSpacing: '-.02em', margin: `${2 * s}px 0`}}>320 000 Kč</b>na účet</div>); };

const Footer: React.FC<{s: number; from: number; clickAt: number}> = ({s, from, clickAt}) => {
  const f = useCurrentFrame(); const p = useS(from, {damping: 15, stiffness: 150}); const strike = clamp(f, from + 16, from + 30, 0, 100);
  const press = f >= clickAt && f < clickAt + 8 ? 0.95 : 1; const ripple = clamp(f, clickAt, clickAt + 18, 0, 1); const rip = f >= clickAt && f < clickAt + 18 ? 1 - ripple : 0;
  return (<div style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 * s, color: '#fff'}}>
    <div style={{fontSize: 34 * s, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 16 * s, flexWrap: 'wrap', justifyContent: 'center', textShadow: '0 4px 20px rgba(0,0,0,.6)'}}>
      <span>Fotovoltaika + zateplení střechy</span><span style={{background: GREEN, padding: `${2 * s}px ${18 * s}px`, borderRadius: 14 * s, fontSize: 44 * s, fontWeight: 700}}>za 65 500 Kč</span>
      <span style={{position: 'relative', color: 'rgba(255,255,255,.75)', fontSize: 28 * s}}>místo 385 500 Kč<span style={{position: 'absolute', left: 0, top: '52%', height: 4 * s, width: `${strike}%`, background: RED, borderRadius: 2}} /></span>
    </div>
    <div style={{position: 'relative', transform: `scale(${press})`, background: RED, color: '#fff', fontSize: 40 * s, fontWeight: 600, padding: `${26 * s}px ${52 * s}px`, borderRadius: 18 * s, boxShadow: '0 24px 50px -16px rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', gap: 18 * s}}>Spočítat můj nárok <span style={{fontSize: 44 * s, lineHeight: 0.8}}>→</span>
      <span style={{position: 'absolute', inset: -4, borderRadius: 20 * s, border: `3px solid #fff`, opacity: rip, transform: `scale(${1 + ripple * 0.18})`, pointerEvents: 'none'}} />
    </div>
    <div style={{fontSize: 22 * s, color: 'rgba(255,255,255,.8)'}}>Zdarma a nezávazně · do 24 h víte, jak na tom jste</div>
  </div>);
};

export const OsvcBanner: React.FC<{format: Fmt}> = ({format}) => {
  const f = useCurrentFrame(); const story = format === 'story';
  const W = 1080, H = story ? 1920 : 1080, s = story ? 1 : 0.74;
  const PT = story ? 270 : 44, PB = story ? 360 : 44, PX = story ? 64 : 48;
  const zoom = clamp(f, 0, BANNER_FRAMES, 1.0, 1.08);
  const A = [0, 142], B = [142, 250], C = [250, 450], D = [372, 450];
  const inC = f >= C[0]; const cardW = W - PX * 2;
  const footerOn = f >= D[0];
  const stageShift = useS(D[0], {damping: 16, stiffness: 120});
  const fadeOut = clamp(f, BANNER_FRAMES - 8, BANNER_FRAMES, 1, 0);
  const footH = story ? 300 : 230;
  return (<AbsoluteFill style={{background: '#12161C', fontFamily: 'P, system-ui, sans-serif', overflow: 'hidden'}}><style>{font}</style>
    <Img src={staticFile(story ? 'img/osvc-story.jpg' : 'img/osvc-wide.jpg')} style={{position: 'absolute', left: 0, right: 0, top: '-12%', width: '100%', height: '112%', objectFit: 'cover', objectPosition: story ? '50% 0%' : '63% 0%', transform: `scale(${zoom})`, transformOrigin: '50% 20%'}} />
    <AbsoluteFill style={{background: story ? 'linear-gradient(180deg, rgba(18,22,28,.9) 0%, rgba(18,22,28,.35) 22%, rgba(18,22,28,.25) 38%, rgba(18,22,28,.86) 62%, rgba(18,22,28,.95) 100%)' : 'linear-gradient(180deg, rgba(18,22,28,.72) 0%, rgba(18,22,28,.3) 30%, rgba(18,22,28,.86) 60%, rgba(18,22,28,.95) 100%)'}} />
    {/* logo NZÚ na střed */}
    <div style={{position: 'absolute', left: 0, right: 0, top: PT - (story ? 10 : 0), display: 'flex', justifyContent: 'center', opacity: fadeOut}}>
      <Img src={staticFile('img/nzu-light-logo-dark.png')} style={{height: (story ? 104 : 74)}} />
    </div>
    {/* jeviště: obsah dole, hlava živnostníka zůstává volná */}
    <div style={{position: 'absolute', left: PX, right: PX, top: PT, bottom: PB, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', opacity: fadeOut}}>
      <div style={{width: '100%', position: 'relative', transform: `translateY(${-stageShift * footH}px) scale(${1 - stageShift * 0.2})`, transformOrigin: 'bottom center'}}>
        {f < A[1] && <Hook s={s} from={A[0]} to={A[1]} />}
        {f >= B[0] && f < B[1] && <Myth s={s} from={B[0]} to={B[1]} />}
        {inC && <div style={{position: 'relative'}}><Calc s={s} from={C[0]} W={cardW} /><Sticker s={s} from={C[0] + 128} style={{right: -14 * s, top: -34 * s}} /></div>}
      </div>
      {footerOn && <div style={{position: 'absolute', left: 0, right: 0, bottom: 0}}><Footer s={s} from={D[0]} clickAt={D[0] + 30} /></div>}
    </div>
    {VO.map((v, i) => <Sequence key={i} from={v.at} layout="none"><Audio src={staticFile(v.f)} /></Sequence>)}
    <Audio src={staticFile('audio/bed.mp3')} volume={(fr) => clamp(fr, 0, 20, 0, 0.28) * clamp(fr, BANNER_FRAMES - 30, BANNER_FRAMES, 1, 0)} />
  </AbsoluteFill>);
};
