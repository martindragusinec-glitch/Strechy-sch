import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export type Audience = 'senior' | 'nizkoprijmove' | 'osvc';
const FPS = 30; const S = (s: number) => Math.round(s * FPS);
const RED = '#DA000F', GREEN = '#24A531', INK = '#1B2028', YEL = '#FFD23F';
const HOOK: Record<Audience, string[]> = {senior: ['Pobíráte', 'starobní důchod?'], nizkoprijmove: ['Pobíráte', 'superdávku?'], osvc: ['Jste OSVČ', 's nižšími příjmy?']};
const PX = 72, PT = 290, PB = 380;
const font = ['600','500','400'].map(w=>`@font-face{font-family:P;src:url(${staticFile(`fonts/poppins-${w}-latin-ext.woff2`)}) format("woff2");font-weight:${w};unicode-range:U+0100-024F,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF}@font-face{font-family:P;src:url(${staticFile(`fonts/poppins-${w}-latin.woff2`)}) format("woff2");font-weight:${w}}`).join('');

const useSpring = (delay: number, cfg = {damping: 12, stiffness: 180, mass: 0.7}) => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return spring({frame: f - delay, fps, config: cfg}); };

/* ---------- stavební prvky ---------- */
const Clip: React.FC<{src: string; from: number; dur: number; zoom?: [number, number]; bright?: number; pos?: string}> = ({src, from, dur, zoom = [1, 1.06], bright = 1, pos = 'center'}) => {
  const f = useCurrentFrame(); const sc = interpolate(f - from, [0, dur], zoom, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (<Sequence from={from} durationInFrames={dur} layout="none"><AbsoluteFill style={{overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(src)} muted style={{width: 1080, height: 1920, objectFit: 'cover', objectPosition: pos, transform: `scale(${sc})`, filter: `brightness(${bright})`}} />
  </AbsoluteFill></Sequence>);
};
const Card: React.FC<{from: number; dur: number; children: React.ReactNode; bg?: string}> = ({from, dur, children, bg = INK}) => (
  <Sequence from={from} durationInFrames={dur} layout="none"><AbsoluteFill style={{background: bg}}>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 1px,transparent 1px 9px)'}} />
    <AbsoluteFill style={{padding: `${PT}px ${PX}px ${PB}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28}}>{children}</AbsoluteFill>
  </AbsoluteFill></Sequence>
);
const Shade: React.FC<{h?: number; top?: boolean}> = ({h = 55, top = false}) => (<AbsoluteFill style={{background: top ? `linear-gradient(180deg, rgba(27,32,40,.75) 0%, rgba(27,32,40,0) ${h}%)` : `linear-gradient(180deg, rgba(27,32,40,0) ${100 - h}%, rgba(27,32,40,.92) 100%)`}} />);
const Logos: React.FC = () => (<div style={{position: 'absolute', left: PX, right: PX, top: PT - 60, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}><Img src={staticFile('img/nzu-light-logo-dark.png')} style={{height: 64}} /><Img src={staticFile('img/schlieger-logo-white.svg')} style={{height: 27, marginTop: 14}} /></div>);
const Pill: React.FC<{children: React.ReactNode; size: number; color?: string}> = ({children, size, color = GREEN}) => (<span style={{display: 'inline-block', background: color, color: '#fff', padding: '.02em .26em .06em', borderRadius: '.2em', whiteSpace: 'nowrap', fontSize: size, lineHeight: 1.05, fontWeight: 600, letterSpacing: '-.03em'}}>{children}</span>);
const Word: React.FC<{i: number; children: React.ReactNode; size?: number; pill?: boolean}> = ({i, children, size = 108, pill}) => {
  const p = useSpring(3 + i * 5); const st: React.CSSProperties = {display: 'block', opacity: p, transform: `translateY(${(1 - p) * 60}px)`, fontSize: size, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-.03em', textShadow: pill ? 'none' : '0 6px 40px rgba(0,0,0,.6)'};
  return <span style={st}>{pill ? <Pill size={size}>{children}</Pill> : children}</span>;
};
const Slide: React.FC<{delay: number; dir?: 'l' | 'r' | 'u'; children: React.ReactNode; style?: React.CSSProperties}> = ({delay, dir = 'u', children, style}) => {
  const p = useSpring(delay); const d = dir === 'l' ? `translateX(${(1 - p) * -700}px)` : dir === 'r' ? `translateX(${(1 - p) * 700}px)` : `translateY(${(1 - p) * 80}px)`;
  return <div style={{opacity: Math.min(1, p * 1.5), transform: d, ...style}}>{children}</div>;
};
const Tile: React.FC<{src: string; t: string; s: string; pos?: string}> = ({src, t, s, pos = 'center'}) => (
  <div style={{position: 'relative', borderRadius: 28, overflow: 'hidden', width: 936, height: 520, boxShadow: '0 40px 80px -24px rgba(0,0,0,.8)'}}>
    <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '22px 30px', fontSize: 44, fontWeight: 600, lineHeight: 1.15, background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.8))'}}>{t}<span style={{display: 'block', fontWeight: 400, fontSize: 30, color: 'rgba(255,255,255,.85)'}}>{s}</span></div>
  </div>
);
const Counter: React.FC<{to: number; from?: number; delay: number; dur: number; size: number; suffix?: string}> = ({to, from = 0, delay, dur, size, suffix = ' Kč'}) => {
  const f = useCurrentFrame(); const v = Math.round(interpolate(f, [delay, delay + dur], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  return <span style={{fontSize: size, fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{v.toLocaleString('cs-CZ').replace(/ /g, ' ')}{suffix}</span>;
};

/* ---------- scény ---------- */
const Hook: React.FC<{a: Audience}> = ({a}) => (
  <div style={{position: 'absolute', left: PX, right: PX, bottom: PB}}>{HOOK[a].map((w, i) => <Word key={w} i={i} size={i === 1 ? 92 : 108} pill={i === 1}>{w}</Word>)}</div>
);
const CardFve: React.FC = () => { const p = useSpring(2, {damping: 10, stiffness: 200}); return (<>
  <div style={{fontSize: 40, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500}}>Co dostanete</div>
  <div style={{transform: `scale(${0.7 + 0.3 * p})`, opacity: p, transformOrigin: 'left center', fontSize: 118, fontWeight: 600, lineHeight: .98, letterSpacing: '-.04em'}}>Fotovoltaika</div>
  <div style={{fontSize: 44, color: 'rgba(255,255,255,.8)', fontWeight: 500}}>3,69 kWp · ohřev vody i dům</div></>); };
const CardZat: React.FC = () => { const p = useSpring(2, {damping: 10, stiffness: 200}); const q = useSpring(10); return (<>
  <div style={{display: 'flex', alignItems: 'center', gap: 28}}><div style={{width: 120, height: 120, borderRadius: 60, background: GREEN, display: 'grid', placeItems: 'center', fontSize: 92, fontWeight: 600, transform: `scale(${p}) rotate(${(1 - p) * 90}deg)`}}>+</div><div style={{fontSize: 40, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500}}>navíc</div></div>
  <div style={{opacity: q, transform: `translateX(${(1 - q) * 80}px)`, fontSize: 124, fontWeight: 600, lineHeight: .98, letterSpacing: '-.04em'}}>Zateplení<br />střechy</div>
  <div style={{opacity: q, fontSize: 44, color: 'rgba(255,255,255,.8)', fontWeight: 500}}>100 m² · mezi krokve</div></>); };
const CardDotace: React.FC = () => { const p = useSpring(2, {damping: 8, stiffness: 260}); const f = useCurrentFrame(); return (<>
  <div style={{fontSize: 40, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500}}>Stát zaplatí předem</div>
  <div style={{color: YEL}}><Counter to={320000} delay={4} dur={26} size={150} /></div>
  <div style={{opacity: p, transform: `rotate(${-14 + 10 * p}deg) scale(${0.5 + 0.5 * p})`, transformOrigin: 'left center', alignSelf: 'flex-start', background: YEL, color: INK, fontWeight: 600, fontSize: 38, lineHeight: 1.05, textAlign: 'center', padding: '.5em .8em', borderRadius: 14, textTransform: 'uppercase', letterSpacing: '.02em', boxShadow: '0 20px 40px -14px rgba(0,0,0,.8)'}}>Dotace předem<b style={{display: 'block', fontSize: 58, letterSpacing: '-.02em'}}>na účet</b></div>
  <div style={{opacity: interpolate(f, [30, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), fontSize: 46, lineHeight: 1.3, fontWeight: 500, color: 'rgba(255,255,255,.9)'}}>Přijde na účet <b>ještě před montáží.</b></div></>); };
const Price: React.FC = () => { const f = useCurrentFrame(); const a = useSpring(2); const line = interpolate(f, [14, 24], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const b = useSpring(26, {damping: 9, stiffness: 240}); return (
  <div style={{position: 'absolute', left: PX, right: PX, bottom: PB, display: 'flex', flexDirection: 'column', gap: 22}}>
    <div style={{opacity: a, fontSize: 44, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', fontWeight: 500}}>Cena celkem</div>
    <div style={{opacity: a, position: 'relative', alignSelf: 'flex-start', fontSize: 92, fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1, color: 'rgba(255,255,255,.75)'}}>385 500 Kč<div style={{position: 'absolute', left: -6, top: '50%', height: 8, marginTop: -4, width: `${line}%`, background: RED, borderRadius: 4}} /></div>
    <div style={{opacity: b, transform: `scale(${0.6 + 0.4 * b})`, transformOrigin: 'left center', fontSize: 44, fontWeight: 500}}>Vy doplatíte jen</div>
    <div style={{opacity: b, transform: `scale(${0.6 + 0.4 * b})`, transformOrigin: 'left center', alignSelf: 'flex-start'}}><Pill size={128}>65 500 Kč</Pill></div>
  </div>); };
const Cta: React.FC = () => { const f = useCurrentFrame(); const a = useSpring(2); const pulse = 1 + 0.04 * Math.sin(Math.max(0, f - 12) / 4); return (
  <div style={{position: 'absolute', left: PX, right: PX, bottom: PB, display: 'flex', flexDirection: 'column', gap: 26}}>
    <div style={{opacity: a, fontSize: 64, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-.03em', textShadow: '0 6px 40px rgba(0,0,0,.6)'}}>Zjistěte za minutu,<br />jestli máte nárok.</div>
    <div style={{opacity: a, transform: `scale(${pulse})`, transformOrigin: 'left center', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '.5em', background: RED, fontWeight: 600, fontSize: 48, padding: '.7em 1.1em', borderRadius: 16, boxShadow: '0 24px 50px -16px rgba(218,0,15,.7)'}}>Ověřit nárok zdarma <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
    <div style={{opacity: a, fontSize: 30, color: 'rgba(255,255,255,.85)', lineHeight: 1.4}}><b>Do 24 h</b> víte, zda máte nárok · <b>23 000+</b> instalací · nezávazně</div>
  </div>); };

export const Spot: React.FC<{audience: Audience}> = ({audience}) => (
  <AbsoluteFill style={{background: INK, fontFamily: 'P, system-ui, sans-serif', color: '#fff'}}><style>{font}</style>
    {/* 0–2.4 hook */}<Clip src={`clips/1-${audience}.mp4`} from={0} dur={S(2.4)} zoom={[1.02, 1.1]} /><Sequence from={0} durationInFrames={S(2.4)} layout="none"><Shade h={60} /><Hook a={audience} /></Sequence>
    {/* 2.4–3.8 karta FVE */}<Card from={S(2.4)} dur={S(1.4)}><CardFve /></Card>
    {/* 3.8–5.8 dron + dlaždice */}<Clip src="clips/2-drone.mp4" from={S(3.8)} dur={S(2)} zoom={[1, 1.08]} /><Sequence from={S(3.8)} durationInFrames={S(2)} layout="none"><Shade h={50} /><div style={{position: 'absolute', left: PX, bottom: PB}}><Slide delay={2} dir="l"><Tile src="img/realizace-zbraslavice-1.jpg" t="Fotovoltaika" s="3,69 kWp, ohřev vody" /></Slide></div></Sequence>
    {/* 5.8–7.2 karta ZAT */}<Card from={S(5.8)} dur={S(1.4)}><CardZat /></Card>
    {/* 7.2–9.2 půda + dlaždice */}<Clip src="clips/3-attic.mp4" from={S(7.2)} dur={S(2)} zoom={[1.05, 1.15]} bright={1.3} /><Sequence from={S(7.2)} durationInFrames={S(2)} layout="none"><Shade h={50} /><div style={{position: 'absolute', left: PX, bottom: PB}}><Slide delay={2} dir="r"><Tile src="img/attic.jpg" t="Zateplení střechy" s="100 m², mezi krokve" pos="center 30%" /></Slide></div></Sequence>
    {/* 9.2–11.4 karta dotace */}<Card from={S(9.2)} dur={S(2.2)}><CardDotace /></Card>
    {/* 11.4–13.4 dům + cena */}<Clip src="clips/4-house.mp4" from={S(11.4)} dur={S(2)} zoom={[1.06, 1.16]} pos="center 30%" /><Sequence from={S(11.4)} durationInFrames={S(2)} layout="none"><Shade h={70} /><Price /></Sequence>
    {/* 13.4–15 CTA */}<Clip src="clips/4-house.mp4" from={S(13.4)} dur={S(1.6)} zoom={[1.16, 1.2]} pos="center 30%" /><Sequence from={S(13.4)} durationInFrames={S(1.6)} layout="none"><Shade h={75} /><Cta /></Sequence>
    <Logos />
  </AbsoluteFill>
);
