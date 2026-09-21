import React from 'react';
import {Composition} from 'remotion';
import {Spot, Audience} from './Spot';
const AUD: Audience[] = ['senior', 'nizkoprijmove', 'osvc'];
export const Root: React.FC = () => (
  <>
    {AUD.map((a) => (
      <Composition key={a} id={`spot-${a}`} component={Spot} durationInFrames={15 * 30} fps={30} width={1080} height={1920} defaultProps={{audience: a}} />
    ))}
  </>
);
