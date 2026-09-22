import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export type Audience = 'senior' | 'nizkoprijmove' | 'osvc';
const FPS = 30; const S = (s: number) => Math.round(s * FPS);
const RED = '#DA000F', GREEN = '#24A531', INK = '#1B2028', YEL = '#FFD23F';
const HOOK: Record<Audience, string[]> = {senior: ['Pobíráte', 'starobní důchod?'], nizkoprijmove: ['Pobíráte', 'superdávku?'], osvc: ['Jste OSVČ', 's nižšími příjmy?']};
const PX = 72, PT = 290, PB = 380;
/* rozvržení: portrét 1080×1920 vs. landscape 1920×1080 (vlevo klip 760 px, vpravo grafika + titulky) */
type Lay = {land: boolean; L: number; R: number; capBottom: number; centerTop: number; centerBottom: number; logoTop: number; col: number; W: number; H: number; pos: string};
const PORT: Lay = {land: false, L: PX, R: PX, capBottom: PB - 10, centerTop: PT + 80, centerBottom: PB + 260, logoTop: PT - 40, col: 0, W: 1080, H: 1920, pos: 'center'};
/* čtverec 1080×1080: klip celoplošně s ořezem na horní část (tváře), karty na střed, titulky dole */
const SQ: Lay = {land: false, L: 64, R: 64, capBottom: 56, centerTop: 150, centerBottom: 310, logoTop: 44, col: 0, W: 1080, H: 1080, pos: 'center 22%'};
const LAND: Lay = {land: true, L: 860, R: 96, capBottom: 64, centerTop: 150, centerBottom: 310, logoTop: 44, col: 760, W: 1920, H: 1080, pos: 'center'};
/* celoplošné scény v landscape (karty, závěr): obsah na střed celé šířky */
const FULL: Lay = {...LAND, L: 96, R: 96, col: 0};
const Full: React.FC<{children: React.ReactNode}> = ({children}) => { const L = useLay(); return <LayCtx.Provider value={L.land ? FULL : L}>{children}</LayCtx.Provider>; };
const LayCtx = React.createContext<Lay>(PORT);
const useLay = () => React.useContext(LayCtx);
/* VO (ElevenLabs, cs): délky v s, změřeno ffmpeg. Scény začínají s větou. */
const VO: Record<string, {file: string; words: string; dur: number}> = {
  'hook-senior': {file: 'audio/hook-senior.mp3', words: 'Pobíráte starobní důchod?', dur: 1.72},
  'hook-nizkoprijmove': {file: 'audio/hook-nizkoprijmove.mp3', words: 'Pobíráte superdávku?', dur: 1.72},
  'hook-osvc': {file: 'audio/hook-osvc.mp3', words: 'Jste OSVČ s nižšími příjmy?', dur: 2.19},
  l2: {file: 'audio/l2-dotace.mp3', words: 'Pak máte nárok na dotaci 320\u00A0000\u00A0Kč.', dur: 3.32},
  l3: {file: 'audio/l3-produkt.mp3', words: 'Na fotovoltaiku i zateplení střechy.', dur: 2.51},
  l4: {file: 'audio/l4-predem.mp3', words: 'A peníze přijdou na účet předem, ještě před montáží.', dur: 3.32},
  l5: {file: 'audio/l5-doplatek.mp3', words: 'Vy doplatíte jen 65\u00A0500\u00A0Kč.', dur: 3.24},
  l6: {file: 'audio/l6-cta.mp3', words: 'Ověřte si nárok zdarma. Zabere to minutu.', dur: 2.85},
  o2: {file: 'audio/o2-zivnost.mp3', words: 'Živnost vám nárok nebere. Rozhoduje příjem domácnosti.', dur: 4.05},
  o3: {file: 'audio/o3-dotace.mp3', words: 'Dotace 320\u00A0000\u00A0Kč na fotovoltaiku i zateplení střechy.', dur: 4.05},
};
const GAP = 0.18; // mezera mezi větami
export const timeline = (a: Audience) => { const keys = a === 'osvc' ? [`hook-${a}`, 'o2', 'o3', 'l4', 'l5', 'l6'] : [`hook-${a}`, 'l2', 'l3', 'l4', 'l5', 'l6']; let t = 0.3; return keys.map((k) => { const st = t; t += VO[k].dur + GAP; return {k, start: st, end: t - GAP}; }); };
export const totalFrames = (a: Audience) => Math.ceil((timeline(a)[5].end + 0.8) * FPS);

/* titulky slovo po slovu: čas slova ~ podíl znaků ve větě */
const Captions: React.FC<{k: string; start: number; size?: number}> = ({k, start, size = 64}) => {
  const f = useCurrentFrame(); const t = f / FPS - start; const v = VO[k]; const words = v.words.split(' ');
  const total = words.reduce((n, w) => n + w.length + 1, 0); let acc = 0;
  const times = words.map((w) => { const s0 = (acc / total) * v.dur; acc += w.length + 1; return s0; });
  const idx = times.filter((x) => t >= x - 0.05).length - 1; const L = useLay();
  return (
    <div style={{position: 'absolute', left: L.L, right: L.R, bottom: L.capBottom, height: size * 1.2 * 3 + 10, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', fontSize: size, fontWeight: 600, lineHeight: 1.2, textShadow: '0 4px 20px rgba(0,0,0,.95), 0 0 40px rgba(0,0,0,.6)', maxWidth: 936}}>
        {words.map((w, i) => { const on = i <= idx; const isNum = /\d/.test(w) || w === 'Kč.' || w === 'Kč'; return <span key={i} style={{display: 'inline-block', margin: '0 .16em', color: isNum && on ? '#FFD23F' : '#fff', opacity: on ? 1 : 0.32, textTransform: 'uppercase', letterSpacing: '-.01em'}}>{w}</span>; })}
      </div>
    </div>
  );
};
/* středový sloupec: vizuál nahoře, titulky pod ním, celé vertikálně na střed bezpečné zóny */
const Center: React.FC<{children: React.ReactNode; gap?: number; bottom?: boolean; top?: boolean}> = ({children, gap = 40, bottom = false, top = false}) => { const L = useLay(); return (
  <div style={{position: 'absolute', left: L.L, right: L.R, top: L.centerTop, bottom: L.centerBottom, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: bottom && !L.land ? 'flex-end' : top && !L.land ? 'flex-start' : 'center', gap}}>{children}</div>
); };
const font = ['600','500','400'].map(w=>`@font-face{font-family:P;src:url(${staticFile(`fonts/poppins-${w}-latin-ext.woff2`)}) format("woff2");font-weight:${w};unicode-range:U+0100-024F,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF}@font-face{font-family:P;src:url(${staticFile(`fonts/poppins-${w}-latin.woff2`)}) format("woff2");font-weight:${w}}`).join('');

const useSpring = (delay: number, cfg = {damping: 12, stiffness: 180, mass: 0.7}) => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return spring({frame: f - delay, fps, config: cfg}); };

/* ---------- stavební prvky ---------- */
const Clip: React.FC<{src: string; from: number; dur: number; zoom?: [number, number]; bright?: number; pos?: string}> = ({src, from, dur, zoom = [1, 1.06], bright = 1, pos = 'center'}) => {
  const f = useCurrentFrame(); const sc = interpolate(f - from, [0, dur], zoom, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const L = useLay();
  if (L.land && !L.col) return (<Sequence from={from} durationInFrames={dur} layout="none"><AbsoluteFill style={{overflow: 'hidden', background: INK}}>
    <OffthreadVideo src={staticFile(src)} muted style={{position: 'absolute', left: '-6%', top: '-6%', width: '112%', height: '112%', objectFit: 'cover', objectPosition: 'center 30%', transform: `scale(${sc})`, filter: 'blur(22px) brightness(.5)'}} />
  </AbsoluteFill></Sequence>);
  if (L.land) return (<Sequence from={from} durationInFrames={dur} layout="none"><AbsoluteFill style={{overflow: 'hidden', background: INK}}>
    <OffthreadVideo src={staticFile(src)} muted style={{position: 'absolute', left: '-6%', top: '-6%', width: '112%', height: '112%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'blur(36px) brightness(.32)'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: L.col, height: 1080, overflow: 'hidden'}}><OffthreadVideo src={staticFile(src)} muted style={{width: L.col, height: 1080, objectFit: 'cover', objectPosition: pos === 'center' ? 'center 22%' : pos, transform: `scale(${sc})`, filter: `brightness(${bright})`}} /></div>
    <div style={{position: 'absolute', left: L.col - 1, top: 0, width: 140, height: 1080, background: 'linear-gradient(90deg, rgba(18,22,28,0), rgba(18,22,28,.55))'}} />
  </AbsoluteFill></Sequence>);
  return (<Sequence from={from} durationInFrames={dur} layout="none"><AbsoluteFill style={{overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(src)} muted style={{width: L.W, height: L.H, objectFit: 'cover', objectPosition: pos === 'center' ? L.pos : pos, transform: `scale(${sc})`, filter: `brightness(${bright})`}} />
  </AbsoluteFill></Sequence>);
};
const Card: React.FC<{children?: React.ReactNode; bg?: string}> = ({children, bg = INK}) => (
  <Full><AbsoluteFill style={{background: bg}}>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 1px,transparent 1px 9px)'}} />
    </AbsoluteFill>{children}</Full>
);
const Shade: React.FC<{h?: number; top?: boolean}> = ({h = 55, top = false}) => (<AbsoluteFill style={{background: top ? `linear-gradient(180deg, rgba(27,32,40,.75) 0%, rgba(27,32,40,0) ${h}%)` : `linear-gradient(180deg, rgba(27,32,40,0) ${100 - h}%, rgba(27,32,40,.92) 100%)`}} />);
const Logos: React.FC = () => { const L = useLay(); return (<div style={{position: 'absolute', left: L.land ? L.L : 0, right: L.land ? L.R : 0, top: L.logoTop, display: 'flex', justifyContent: 'center'}}><Img src={staticFile('img/nzu-light-logo-dark.png')} style={{height: 84, filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.6))'}} /></div>); };
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
const CardDotace: React.FC = () => { const f = useCurrentFrame(); return (<>
  <div style={{fontSize: 40, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500}}>Dotace NZÚ Light</div>
  <div style={{color: YEL}}><Counter to={320000} delay={4} dur={34} size={160} /></div>
  <div style={{opacity: interpolate(f, [30, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), fontSize: 50, lineHeight: 1.25, fontWeight: 500, color: 'rgba(255,255,255,.9)'}}>Máte na ni <b>nárok</b>.</div></>); };
const ZivnostCard: React.FC = () => { const a = useSpring(3), b = useSpring(18), x = useSpring(10, {damping: 9, stiffness: 260}); const Row = (p: number, ok: boolean, t: string) => (<div style={{opacity: p, transform: `translateX(${(1 - p) * 60}px)`, display: 'flex', alignItems: 'center', gap: 26, fontSize: 56, fontWeight: 600, letterSpacing: '-.02em'}}><div style={{width: 84, height: 84, borderRadius: 42, flex: 'none', background: ok ? GREEN : RED, display: 'grid', placeItems: 'center'}}><svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">{ok ? <path d="M5 12.5l4.5 4.5L19 7" /> : <path d="M6 6l12 12M18 6L6 18" />}</svg></div><span style={{position: 'relative'}}>{t}{!ok && <span style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 6, marginTop: -3, background: RED, borderRadius: 3, transform: `scaleX(${x})`, transformOrigin: 'left'}} />}</span></div>);
  return (<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26, background: 'rgba(27,32,40,.55)', padding: '34px 44px', borderRadius: 28}}><div style={{fontSize: 38, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500, alignSelf: 'center'}}>Kdo má nárok</div>{Row(a, false, 'Podle živnosti')}{Row(b, true, 'Podle příjmu domácnosti')}</div>); };
const CenterInCard: React.FC<{children: React.ReactNode}> = ({children}) => (<Center gap={34}><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, textAlign: 'center'}}>{children}</div></Center>);
const HookCentered: React.FC<{a: Audience}> = ({a}) => { const [w1, w2] = HOOK[a]; const p = useSpring(3), q = useSpring(9); return (<div style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
  <div style={{opacity: p, transform: `translateY(${(1 - p) * 50}px)`, fontSize: 108, fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.05, textShadow: '0 6px 40px rgba(0,0,0,.7)'}}>{w1}</div>
  <div style={{opacity: q, transform: `scale(${0.7 + 0.3 * q})`}}><Pill size={a === 'osvc' ? 84 : 96}>{w2}</Pill></div></div>); };
const Tiles: React.FC = () => { const f = useCurrentFrame(); const a = useSpring(2), b = useSpring(6), c = useSpring(10); const T = (src: string, t: string, s2: string, st: number, pos = 'center') => (<div style={{opacity: st, transform: `scale(${0.8 + 0.2 * st})`, position: 'relative', borderRadius: 24, overflow: 'hidden', width: 420, height: 300, boxShadow: '0 30px 60px -20px rgba(0,0,0,.8)'}}><Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} /><div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 18px', fontSize: 32, fontWeight: 600, lineHeight: 1.15, background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.85))'}}>{t}<span style={{display: 'block', fontWeight: 400, fontSize: 24, color: 'rgba(255,255,255,.85)'}}>{s2}</span></div></div>);
  return (<div style={{display: 'flex', alignItems: 'center', gap: 22}}>{T('img/realizace-zbraslavice-1.jpg', 'Fotovoltaika', '3,69 kWp', a)}<div style={{opacity: b, transform: `scale(${b}) rotate(${(1 - b) * 90}deg)`, width: 74, height: 74, borderRadius: 37, background: GREEN, display: 'grid', placeItems: 'center', fontSize: 54, fontWeight: 600, flex: 'none', boxShadow: '0 0 0 10px rgba(18,22,28,.9)'}}>+</div>{T('img/attic.jpg', 'Zateplení střechy', '100 m²', c, 'center 30%')}</div>); };
const StickerCentered: React.FC = () => { const p = useSpring(3, {damping: 8, stiffness: 260}); return (<div style={{opacity: p, transform: `rotate(${-14 + 10 * p}deg) scale(${0.5 + 0.5 * p})`, background: YEL, color: INK, fontWeight: 600, fontSize: 48, lineHeight: 1.05, textAlign: 'center', padding: '.5em .9em', borderRadius: 18, textTransform: 'uppercase', letterSpacing: '.02em', boxShadow: '0 24px 50px -14px rgba(0,0,0,.8)'}}>Dotace předem<b style={{display: 'block', fontSize: 84, letterSpacing: '-.02em'}}>320 000 Kč</b>na účet</div>); };
const PriceCentered: React.FC = () => { const f = useCurrentFrame(); const a = useSpring(2); const line = interpolate(f, [16, 28], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const b = useSpring(34, {damping: 9, stiffness: 240}); return (<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
  <div style={{opacity: a, fontSize: 36, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500}}>Cena celkem</div>
  <div style={{opacity: a, position: 'relative', fontSize: 96, fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1, color: 'rgba(255,255,255,.8)'}}>385 500 Kč<div style={{position: 'absolute', left: -6, top: '50%', height: 9, marginTop: -4, width: `${line}%`, background: RED, borderRadius: 4}} /></div>
  <div style={{opacity: b, transform: `scale(${0.6 + 0.4 * b})`, fontSize: 40, fontWeight: 500, marginTop: 8}}>Vy doplatíte jen</div>
  <div style={{opacity: b, transform: `scale(${0.6 + 0.4 * b})`}}><Pill size={150}>65 500 Kč</Pill></div></div>); };
const CtaCentered: React.FC = () => { const f = useCurrentFrame(); const a = useSpring(8);
  const CLICK = 30; // snímek kliknutí
  const press = interpolate(f, [CLICK - 4, CLICK, CLICK + 6], [1, 0.93, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ring = interpolate(f, [CLICK, CLICK + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fx = interpolate(f, [CLICK - 22, CLICK - 2], [220, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const fy = interpolate(f, [CLICK - 22, CLICK - 2], [260, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fo = interpolate(f, [CLICK - 24, CLICK - 18, CLICK + 10, CLICK + 18], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: a}}>
  <div style={{position: 'relative'}}>
  <div style={{position: 'absolute', left: '50%', top: '50%', width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: 60, border: '6px solid #fff', opacity: (1 - ring) * 0.9, transform: `scale(${1 + ring * 3.2})`, pointerEvents: 'none'}} />
  <div style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -20 + fx, marginTop: -10 + fy, opacity: fo, transform: `scale(${press < 1 ? 0.92 : 1})`, pointerEvents: 'none', zIndex: 2}}><svg width="96" height="96" viewBox="0 0 24 24" fill="#fff" stroke="#1B2028" strokeWidth="0.9" strokeLinejoin="round"><path d="M9 11.5V4.5a1.5 1.5 0 0 1 3 0v6l3.2.6c1.4.3 2.3 1.5 2.3 2.9V17a4 4 0 0 1-4 4h-2.4a4 4 0 0 1-3.3-1.7l-2.6-3.7a1.3 1.3 0 0 1 2-1.6L9 15.2v-3.7z"/></svg></div>
  <div style={{transform: `scale(${press})`, display: 'inline-flex', alignItems: 'center', gap: '.5em', background: RED, fontWeight: 600, fontSize: 52, padding: '.7em 1.2em', borderRadius: 18, boxShadow: '0 24px 50px -16px rgba(218,0,15,.8)', background: press < 1 ? '#AD0F1A' : RED}}>Ověřit nárok zdarma <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
  <div style={{fontSize: 30, color: 'rgba(255,255,255,.9)', lineHeight: 1.4, textAlign: 'center'}}><b>Do 24 h</b> víte, zda máte nárok · nezávazně a zdarma</div></div>); };
const Sticker: React.FC = () => { const p = useSpring(3, {damping: 8, stiffness: 260}); const q = useSpring(16); return (
  <div style={{position: 'absolute', left: PX, right: PX, bottom: PB, display: 'flex', flexDirection: 'column', gap: 26}}>
    <div style={{opacity: p, transform: `rotate(${-16 + 12 * p}deg) scale(${0.5 + 0.5 * p})`, transformOrigin: 'left center', alignSelf: 'flex-start', background: YEL, color: INK, fontWeight: 600, fontSize: 44, lineHeight: 1.05, textAlign: 'center', padding: '.5em .8em', borderRadius: 16, textTransform: 'uppercase', letterSpacing: '.02em', boxShadow: '0 24px 50px -14px rgba(0,0,0,.8)'}}>Dotace předem<b style={{display: 'block', fontSize: 70, letterSpacing: '-.02em'}}>320 000 Kč</b>na účet</div>
    <div style={{opacity: q, transform: `translateY(${(1 - q) * 40}px)`, fontSize: 56, fontWeight: 600, lineHeight: 1.15, textShadow: '0 6px 40px rgba(0,0,0,.7)'}}>Ještě <span style={{color: YEL}}>před montáží.</span></div>
  </div>); };
const PriceCard: React.FC = () => { const f = useCurrentFrame(); const a = useSpring(2); const line = interpolate(f, [16, 28], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const b = useSpring(34, {damping: 9, stiffness: 240}); return (<>
    <div style={{opacity: a, fontSize: 40, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500}}>Cena celkem</div>
    <div style={{opacity: a, position: 'relative', alignSelf: 'flex-start', fontSize: 104, fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1, color: 'rgba(255,255,255,.8)'}}>385 500 Kč<div style={{position: 'absolute', left: -6, top: '50%', height: 9, marginTop: -4, width: `${line}%`, background: RED, borderRadius: 4}} /></div>
    <div style={{opacity: b, transform: `scale(${0.6 + 0.4 * b})`, transformOrigin: 'left center', fontSize: 44, fontWeight: 500, marginTop: 10}}>Vy doplatíte jen</div>
    <div style={{opacity: b, transform: `scale(${0.6 + 0.4 * b})`, transformOrigin: 'left center', alignSelf: 'flex-start'}}><Pill size={150}>65 500 Kč</Pill></div></>); };
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

export const Spot: React.FC<{audience: Audience; land?: boolean; sq?: boolean}> = ({audience, land = false, sq = false}) => {
  const tl = timeline(audience); const [h, l2, l3, l4, l5, l6] = tl; const END = tl[5].end + 0.8; const sc = (x: number) => S(x);
  const mid3 = l3.start + (l3.end - l3.start) * 0.55;
  const isO = audience === 'osvc';
  const lay = land ? LAND : sq ? SQ : PORT;
  return (<LayCtx.Provider value={lay}>
  <AbsoluteFill style={{background: INK, fontFamily: 'P, system-ui, sans-serif', color: '#fff'}}><style>{font}</style>
    {/* hook */}<Clip src={`clips/1-${audience}.mp4`} from={0} dur={sc(l2.start)} zoom={[1.02, 1.1]} /><Sequence from={0} durationInFrames={sc(l2.start)} layout="none">{land ? <Center><HookCentered a={audience} /></Center> : <><Shade h={55} /><div style={{position: 'absolute', left: lay.L, right: lay.R, bottom: lay.capBottom, display: 'flex', justifyContent: 'center'}}><HookCentered a={audience} /></div></>}</Sequence>
    {/* scéna 2 */}{isO ? <Clip src="clips/5-osvc-work.mp4" from={sc(l2.start)} dur={sc(l3.start - l2.start)} zoom={[1.02, 1.1]} /> : null}
    <Sequence from={sc(l2.start)} durationInFrames={sc(l3.start - l2.start)} layout="none">{isO ? (<><AbsoluteFill style={{background: 'rgba(18,22,28,.72)'}} /><Center top gap={34}><ZivnostCard /></Center><Captions k="o2" start={0} /></>) : (<Card><CenterInCard><div style={{fontSize: 40, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 500}}>Dotace NZÚ Light</div><div style={{color: YEL}}><Counter to={320000} delay={4} dur={34} size={170} /></div></CenterInCard><Captions k="l2" start={0} /></Card>)}</Sequence>
    {/* scéna 3 */}<Clip src="clips/2-drone.mp4" from={sc(l3.start)} dur={sc(mid3 - l3.start)} zoom={[1, 1.08]} /><Clip src="clips/3-attic.mp4" from={sc(mid3)} dur={sc(l4.start - mid3)} zoom={[1.05, 1.15]} bright={1.3} />
    <Sequence from={sc(l3.start)} durationInFrames={sc(l4.start - l3.start)} layout="none"><AbsoluteFill style={{background: 'rgba(18,22,28,.5)'}} /><Center gap={30}>{isO ? <div style={{color: YEL}}><Counter to={320000} delay={3} dur={30} size={150} /></div> : null}<Tiles /></Center><Captions k={isO ? 'o3' : 'l3'} start={0} /></Sequence>
    {/* scéna 4 */}<Clip src={isO ? 'clips/6-osvc-kitchen.mp4' : 'clips/4-house.mp4'} from={sc(l4.start)} dur={sc(l5.start - l4.start)} zoom={[1.06, 1.16]} pos="center 30%" /><Sequence from={sc(l4.start)} durationInFrames={sc(l5.start - l4.start)} layout="none"><AbsoluteFill style={{background: 'rgba(18,22,28,.5)'}} /><Center bottom={isO}><StickerCentered /></Center><Captions k="l4" start={0} /></Sequence>
    {/* scéna 5 */}<Sequence from={sc(l5.start)} durationInFrames={sc(l6.start - l5.start)} layout="none"><Card><CenterInCard><PriceCentered /></CenterInCard><Captions k="l5" start={0} /></Card></Sequence>
    {/* scéna 6 */}<Full><Clip src="clips/4-house.mp4" from={sc(l6.start)} dur={sc(END - l6.start)} zoom={[1.16, 1.22]} pos="center 30%" /><Sequence from={sc(l6.start)} durationInFrames={sc(END - l6.start)} layout="none"><AbsoluteFill style={{background: 'rgba(18,22,28,.55)'}} /><Center><CtaCentered /></Center><Captions k="l6" start={0} /></Sequence></Full>
    {tl.map(({k, start}) => <Sequence key={'a' + k} from={sc(start)} layout="none"><Audio src={staticFile(VO[k].file)} volume={1} /></Sequence>)}
    <Audio src={staticFile('audio/bed.mp3')} volume={0.5} />
    <Logos />
  </AbsoluteFill></LayCtx.Provider>);
};
