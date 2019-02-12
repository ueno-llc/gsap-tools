/// <reference types="react"/>
/// <reference types="gsap"/>

import * as React from 'react';
import { TweenLite, TimelineLite } from 'gsap';

interface IGsapTools {
  onClick?: () => void;
  isVisible?: boolean;
  isFixed?: boolean;
}

export function add(animation: TweenLite | TimelineLite, animationId?: string): GsapTools;
export default class GsapTools extends React.PureComponent<IGsapTools> {}
