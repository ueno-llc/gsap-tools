import React, { PureComponent } from 'react';
import { TimelineLite } from 'gsap';

import './Logo.css';

export default class Logo extends PureComponent {

  get timelineEnter() {
    const t = new TimelineLite();
    const logoPath = this.logo.childNodes;
    const ease = 'Linear.easeNone';

    t.addLabel('start')
      .set(logoPath, {
        autoAlpha: 0,
        strokeDashoffset: 1500,
        strokeDasharray: '0, 9999',
        fill: 'transparent',
        stroke: '#ccc',
        transformOrigin: 'center',
      })
      .to(logoPath, 0.1, { autoAlpha: 1 })
      .staggerTo(logoPath, 1.5, { strokeDashoffset: 0, strokeDasharray: '1500, 1500', ease }, 0.5, 'start')
      .addLabel('endDraw')
      .staggerTo(logoPath, 0.5, { fill: '#000', ease: 'Power2.easeIn' }, 0.15, 'endDraw-=0.5')
      .staggerTo(logoPath, 0.5, { stroke: 'transparent', ease }, 0.15, 'endDraw-=0.5');

    return t;
  }

  get timelineLeave() {
    const t = new TimelineLite();
    const logoPath = this.logo.childNodes;
    const ease = 'Power4.easeInOut';
    const offsetLeft = `${(35 / 1175) * 100}%`;
    const offsetTop = `${(35 / 270) * 100}%`;

    t.addLabel('start')
      .set([logoPath, this.dot, this.dotInner], { transformOrigin: 'center' })
      .set(logoPath[4], { autoAlpha: 0, immediateRender: false })
      .set(this.dot, { autoAlpha: 1, immediateRender: false })
      .to(logoPath[0], 1.5, { rotation: -700, x: '-600%', y: -200, autoAlpha: 0, ease }, 'start')
      .to(logoPath[1], 1.5, { rotation: 700, x: '-400%', y: -600, autoAlpha: 0, ease }, 'start')
      .to(logoPath[2], 1.5, { rotation: 700, x: '400%', y: -600, autoAlpha: 0, ease }, 'start')
      .to(logoPath[3], 1.5, { rotation: 700, x: '600%', y: 600, autoAlpha: 0, ease }, 'start')
      .to(this.dot, 1.5, { x: '-50%', y: '-50%', left: offsetLeft, top: offsetTop, ease }, 'start')
      .to(this.dotInner, 1.5, { scale: 10, ease, force3D: false }, 'start')
      .to(this.dotSvg, 1.5, { fill: '#ab80ff' }, 'start')
      .set(this.dotInner, { opacity: 0 });

    return t;
  }

  render() {
    return (
      <div className="logo">
        <svg className="logo__svg" ref={(el) => { this.logo = el; }} fill="none" stroke="transparent" strokeWidth="1" viewBox="0 0 1175 270">
          <path d="M177.5 7h69.7v256h-69.7v-41.8c-12.8 29-45.3 48.8-83.6 48.8C25.4 270 .4 223.5.4 166.6V7h69.7v145.7c0 39.5 15.7 62.1 49.9 62.1 35.4 0 57.5-27.9 57.5-70.8V7z" />
          <path d="M467.7 190.2c-11.4 17.9-29.7 26.9-56.6 26.9-37.7 0-67.4-26.7-69.7-64.5h192.2v-25C533.6 58.1 490.6 0 407 0c-76.6 0-134.1 58.1-134.1 138.8 0 80.7 56.9 131.2 135.9 131.2 50.1 0 87.6-19.6 108.5-54.2l-49.6-25.6zM406.4 51.1c38.9 0 56.9 28.5 59.2 58.1h-123c6.4-32 25.5-58.1 63.8-58.1z" />
          <path d="M629 263h-69.7V7H629v41.8C641.7 19.7 674.3 0 712.6 0c68.5 0 93.5 46.5 93.5 103.4V263h-69.7V117.3c0-39.5-15.7-62.1-49.9-62.1C651 55.2 629 83 629 126v137z" />
          <path d="M966.5 270c-79 0-134.7-55.2-134.7-134.7C831.8 55.7 887.5 0 966.5 0c79.5 0 135.3 55.7 135.3 135.3 0 79.5-55.8 134.7-135.3 134.7zm0-52.8c43 0 65-33.7 65-81.9 0-48.8-22.1-82.5-65-82.5-42.4 0-64.5 33.7-64.5 82.5 0 48.2 22.1 81.9 64.5 81.9z" />
          <circle cx="1140" cy="235" r="35" />
        </svg>

        <div className="logo__dot" ref={(el) => { this.dot = el; }}>
          <div className="logo__dotInner" ref={(el) => { this.dotInner = el; }}>
            <svg viewBox="0 0 70 70" preserveAspectRatio="none" ref={(el) => { this.dotSvg = el; }}>
              <circle cx="35" cy="35" r="35" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
