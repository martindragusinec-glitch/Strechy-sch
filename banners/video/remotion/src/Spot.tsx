import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type Audience = 'senior' | 'nizkoprijmove' | 'osvc';
const FPS = 30;
const S = (s: number) => Math.round(s * FPS);
const RED = '#DA000F', GREEN = '#24A531', INK = '#1B2028';
const HOOK: Record<Audience, [string, string]> = {
  senior: ['Pobíráte', 'starobní důchod?'],
  nizkoprijmove: ['Pobíráte', 'superdávku?'],
  osvc: ['Jste OSVČ', 's nižšími příjmy?'],
};
const font = `@font-face{font-family:P;src:url(${staticFile('fonts/poppins-600-latin-ext.woff2')}) format("woff2");font-weight:600;unicode-range:U+0100-024F,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-600-latin.woff2')}) format("woff2");font-weight:600}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-500-latin-ext.woff2')}) format("woff2");font-weight:500;unicode-range:U+0100-024F,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-500-latin.woff2')}) format("woff2");font-weight:500}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-400-latin-ext.woff2')}) format("woff2");font-weight:400;unicode-range:U+0100-024F,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF}
@font-face{font-family:P;src:url(${staticFile('fonts/poppins-400-latin.woff2')}) format("woff2");font-weight:400}`;

const PX = 72, PT = 290, PB = 380;

/* --- pomocné animace --- */
const usePop = (delay = 0) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: f - delay, fps, config: {damping: 14, stiffness: 160, mass: 0.8}});
  return {opacity: interpolate(p, [0, 1], [0, 1]), transform: `translateY(${(1 - p) * 40}px) scale(${0.96 + 0.04 * p})`};
};
const useFadeOut = (from: number, len = 8) => {
  const f = useCurrentFrame();
  return interpolate(f, [from, from + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

/* --- klip s crossfadem --- */
const Clip: React.FC<{src: string; from: number; dur: number; fadeIn?: boolean}> = ({src, from, dur, fadeIn = true}) => {
  const f = useCurrentFrame();
  const op = fadeIn ? interpolate(f, [from, from + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <Sequence from={from} durationInFrames={dur + 8} layout="none">
      <AbsoluteFill style={{opacity: op}}>
        <OffthreadVideo src={staticFile(src)} style={{width: 1080, height: 1920, objectFit: 'cover'}} muted />
      </AbsoluteFill>
    </Sequence>
  );
};

const Shade: React.FC<{h?: number}> = ({h = 62}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(27,32,40,0) ${100 - h}%, rgba(27,32,40,.55) ${100 - h * 0.6}%, rgba(27,32,40,.92) 100%)`}} />
);

const Logos: React.FC = () => (
  <div style={{position: 'absolute', left: PX, right: PX, top: PT, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
    <Img src={staticFile('img/nzu-light-logo-dark.png')} style={{height: 70}} />
    <Img src={staticFile('img/schlieger-logo-white.svg')} style={{height: 29, marginTop: 15}} />
  </div>
);

const Pill: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 96}) => (
  <span style={{display: 'inline-block', background: GREEN, color: '#fff', padding: '.02em .26em .06em', borderRadius: '.2em', whiteSpace: 'nowrap', fontSize: size, lineHeight: 1.05}}>{children}</span>
);

const Bottom: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 28}) => (
  <div style={{position: 'absolute', left: PX, right: PX, bottom: PB, display: 'flex', flexDirection: 'column', gap}}>{children}</div>
);

const Tile: React.FC<{src: string; t: string; s: string; delay: number}> = ({src, t, s, delay}) => {
  const st = usePop(delay);
  return (
    <div style={{...st, position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '16/9', flex: 1, boxShadow: '0 30px 60px -20px rgba(0,0,0,.7)'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px', fontSize: 29, fontWeight: 600, lineHeight: 1.2, background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.78))'}}>
        {t}<span style={{display: 'block', fontWeight: 400, fontSize: 23, color: 'rgba(255,255,255,.8)'}}>{s}</span>
      </div>
    </div>
  );
};

/* --- scény --- */
const Scene1: React.FC<{a: Audience}> = ({a}) => {
  const st = usePop(4); const op = useFadeOut(S(3.2));
  return (<Bottom><div style={{...st, opacity: st.opacity * op, fontSize: 96, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-.03em', textShadow: '0 4px 30px rgba(0,0,0,.55)'}}>{HOOK[a][0]} <Pill>{HOOK[a][1]}</Pill></div></Bottom>);
};
const Scene23: React.FC = () => {
  const f = useCurrentFrame(); const op = useFadeOut(S(9.6));
  const plus = usePop(S(3.5));
  return (
    <Bottom><div style={{opacity: op, display: 'flex', alignItems: 'center', gap: 24}}>
      <Tile src="img/realizace-zbraslavice-1.jpg" t="Fotovoltaika" s="3,69 kWp, ohřev vody" delay={6} />
      <div style={{...plus, width: 70, height: 70, borderRadius: 35, background: GREEN, display: 'grid', placeItems: 'center', fontSize: 49, fontWeight: 600, boxShadow: '0 0 0 10px rgba(18,22,28,.9)', flex: 'none'}}>+</div>
      <div style={{flex: 1, opacity: f >= S(3.5) ? 1 : 0}}><Tile src="img/attic.jpg" t="Zateplení střechy" s="100 m², mezi krokve" delay={S(3.5) + 4} /></div>
    </div></Bottom>
  );
};
const Scene4: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const op = useFadeOut(S(2.6));
  const p = spring({frame: f - 3, fps, config: {damping: 9, stiffness: 220}});
  const txt = usePop(14);
  return (
    <Bottom gap={26}>
      <div style={{opacity: op * interpolate(p, [0, 1], [0, 1]), transform: `rotate(${-14 + 10 * p}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: 'left center', alignSelf: 'flex-start', background: '#FFD23F', color: INK, fontWeight: 600, fontSize: 34, lineHeight: 1.05, textAlign: 'center', padding: '.5em .8em', borderRadius: 14, boxShadow: '0 14px 34px -12px rgba(0,0,0,.7)', textTransform: 'uppercase', letterSpacing: '.02em'}}>
        Dotace předem<b style={{display: 'block', fontSize: 51, letterSpacing: '-.02em'}}>320 000 Kč</b>na účet
      </div>
      <div style={{...txt, opacity: txt.opacity * op, fontSize: 60, fontWeight: 500, lineHeight: 1.15, textShadow: '0 4px 30px rgba(0,0,0,.55)'}}>Přijde na účet <b style={{fontWeight: 600}}>ještě před montáží.</b></div>
    </Bottom>
  );
};
const Scene5: React.FC = () => {
  const a = usePop(3), b = usePop(12), c = usePop(22);
  return (
    <Bottom gap={26}>
      <div style={{...a, fontSize: 60, fontWeight: 600, lineHeight: 1.15, textShadow: '0 4px 30px rgba(0,0,0,.55)'}}>Vy doplatíte jen <Pill size={81}>65 500 Kč</Pill></div>
      <div style={{...b, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'baseline', gap: '.4em', background: 'rgba(255,255,255,.14)', border: '2px solid rgba(255,255,255,.35)', fontSize: 30, fontWeight: 500, padding: '.45em .7em', borderRadius: 12}}>
        <span style={{fontSize: 22, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)'}}>místo</span>
        <span style={{position: 'relative', fontWeight: 600}}>385 500 Kč<span style={{position: 'absolute', left: '-.1em', right: '-.1em', top: '50%', height: '.11em', marginTop: '-.05em', background: RED, borderRadius: 2}} /></span>
      </div>
      <div style={{...c, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24}}>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: '.5em', background: RED, fontWeight: 600, fontSize: 40, padding: '.72em 1.1em', borderRadius: 14, whiteSpace: 'nowrap', boxShadow: '0 20px 40px -16px rgba(218,0,15,.6)'}}>Ověřit nárok zdarma <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
        <div style={{fontSize: 23, color: 'rgba(255,255,255,.85)', textAlign: 'right', lineHeight: 1.35, textShadow: '0 2px 12px rgba(0,0,0,.6)'}}><b>Do 24 h</b> víte, zda máte nárok<br /><b>23 000+</b> instalací · nezávazně</div>
      </div>
    </Bottom>
  );
};

export const Spot: React.FC<{audience: Audience}> = ({audience}) => {
  const clip1 = audience === 'senior' ? 'clips/1-senior.mp4' : `clips/1-${audience}.mp4`;
  return (
    <AbsoluteFill style={{background: INK, fontFamily: 'P, system-ui, sans-serif', color: '#fff'}}>
      <style>{font}</style>
      <Clip src={clip1} from={0} dur={S(3.5)} fadeIn={false} />
      <Clip src="clips/2-drone.mp4" from={S(3.4)} dur={S(3.6)} />
      <Clip src="clips/3-attic.mp4" from={S(6.9)} dur={S(3.1)} />
      <Clip src="clips/4-house.mp4" from={S(9.9)} dur={S(5.1)} />
      <Sequence from={0} durationInFrames={S(3.5)} layout="none"><Shade h={45} /><Scene1 a={audience} /></Sequence>
      <Sequence from={S(3.5)} durationInFrames={S(6.5)} layout="none"><Shade /><Scene23 /></Sequence>
      <Sequence from={S(10)} durationInFrames={S(2.7)} layout="none"><Shade /><Scene4 /></Sequence>
      <Sequence from={S(12.6)} durationInFrames={S(2.4)} layout="none"><Shade h={70} /><Scene5 /></Sequence>
      <Logos />
    </AbsoluteFill>
  );
};
