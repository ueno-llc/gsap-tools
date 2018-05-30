import React, { PureComponent } from 'react';
import { TimelineLite } from 'gsap';

import './Hero.css';

export default class Circles extends PureComponent {

  get timelineEnter() {
    const t = new TimelineLite();
    const t1 = new TimelineLite();
    const t2 = new TimelineLite();

    const ease = 'Linear.easeNone';
    const circle = this.circles.childNodes;
    const greyCircle = this.secondaryCircles.childNodes;

    t.addLabel('start').set([greyCircle, circle], { autoAlpha: 0, scale: 0.2, y: '-150%', transformOrigin: 'center' });

    t1.addLabel('start')
      .to(circle, 0.3, { autoAlpha: 1, ease }, 'start')
      .to(circle, 0.5, { scale: 1, ease }, 'start')
      .to(circle, 4.5, { y: '0%', ease: 'Power4.easeOut' }, 'start+=0.25')
      .to(circle, 0.25, { scale: 0.85, ease }, 'start+=0.5')
      .to(circle, 0.5, { scale: 1 }, 'start+=0.75');

    t2.addLabel('start')
      .to(greyCircle, 0.3, { autoAlpha: 1, ease }, 'start')
      .to(greyCircle, 0.5, { scale: 1, ease }, 'start')
      .to(greyCircle, 4, { y: '10%', ease: 'Power4.easeOut' }, 'start+=0.25')
      .to(greyCircle, 0.25, { scale: 0.95, ease }, 'start+=0.5')
      .to(greyCircle, 0.5, { scale: 1 }, 'start+=0.75');

    t.add(t1).add(t2, 'start+=0.5');

    return t;
  }

  get timelineLeave() {
    const t = new TimelineLite();
    const t1 = new TimelineLite();
    const t2 = new TimelineLite();

    const circle = this.circles.childNodes;
    const greyCircle = this.secondaryCircles.childNodes;
    const ease = 'Power4.easeOut';

    t.addLabel('start');

    t1
      .addLabel('start')
      .to(greyCircle, 2, { autoAlpha: 0 })
      .to(greyCircle[0], 2, { x: '200%', y: '-250%', ease }, 'start')
      .to(greyCircle[1], 2, { y: '100%', ease }, 'start')
      .to(greyCircle[2], 2, { x: '-200%', y: '-200%', ease }, 'start');

    t2
      .addLabel('start')
      .to(circle[0], 2, { x: '200%', y: '800%', autoAlpha: 0, ease })
      .to(circle[1], 2, { x: '-200%', y: '200%', autoAlpha: 0, ease }, 'start')
      .to(circle[2], 2, { x: '200%', y: '200%', autoAlpha: 0, ease }, 'start');

    t.add(t1).add(t2, 'start');

    return t;
  }

  render() {
    return (
      <svg className="hero__svg" viewBox="0 0 1670 1180">
        <radialGradient id="gradient-blue" cx="20%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#8ed8f7" />
          <stop offset="100%" stopColor="#34c1fc" />
        </radialGradient>

        <radialGradient id="gradient-pink" cx="20%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#e888ff" />
          <stop offset="100%" stopColor="#cf5eea" />
        </radialGradient>

        <radialGradient id="gradient-green" cx="20%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#cbf9ed" />
          <stop offset="100%" stopColor="#1de1ae" />
        </radialGradient>

        <radialGradient id="gradient-grey" cx="20%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#f9f9f9" />
          <stop offset="100%" stopColor="#eee" />
        </radialGradient>

        <g ref={(el) => { this.secondaryCircles = el; }}>
          <circle cx="1144" cy="165" r="130" fill="url(#gradient-grey)" />
          <circle cx="780" cy="1290" r="190" fill="url(#gradient-grey)" />
          <circle cx="240" cy="116" r="266" fill="url(#gradient-grey)" />
        </g>

        <g ref={(el) => { this.circles = el; }}>
          <circle cx="495" cy="-75" r="165" fill="url(#gradient-green)" />
          <circle cx="432" cy="862" r="102" fill="url(#gradient-pink)" />
          <circle cx="1254" cy="1062" r="432" fill="url(#gradient-blue)" />
        </g>
      </svg>
    );
  }
}
