import React from 'react';
import {Composition} from 'remotion';
import {Spot, Audience, totalFrames} from './Spot';
import {OsvcBanner, BANNER_FRAMES} from './OsvcBanner';
const AUD: Audience[] = ['senior', 'nizkoprijmove', 'osvc'];
export const Root: React.FC = () => (<>{AUD.map((a) => (<Composition key={a} id={`spot-${a}`} component={Spot} durationInFrames={totalFrames(a)} fps={30} width={1080} height={1920} defaultProps={{audience: a}} />))}{AUD.map((a) => (<Composition key={a + '11'} id={`spot-11-${a}`} component={Spot} durationInFrames={totalFrames(a)} fps={30} width={1080} height={1080} defaultProps={{audience: a, sq: true}} />))}{AUD.map((a) => (<Composition key={a + '169'} id={`spot-169-${a}`} component={Spot} durationInFrames={totalFrames(a)} fps={30} width={1920} height={1080} defaultProps={{audience: a, land: true}} />))}<Composition id="osvc-banner-story" component={OsvcBanner} durationInFrames={BANNER_FRAMES} fps={30} width={1080} height={1920} defaultProps={{format: 'story'}} /><Composition id="osvc-banner-square" component={OsvcBanner} durationInFrames={BANNER_FRAMES} fps={30} width={1080} height={1080} defaultProps={{format: 'square'}} /></>);
