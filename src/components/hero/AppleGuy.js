import React, { PureComponent } from 'react';
import { TimelineLite, TimelineMax } from 'gsap'; // eslint-disable-line

import './AppleGuy.css';

export default class AppleGuy extends PureComponent {

  static defaultProps = {
    children: undefined,
  }

  get timelineEnter() {
    const t = new TimelineLite();
    const wave = new TimelineMax();
    const eyes = this.eyes.childNodes;

    wave
      .set(this.arm, { rotation: 0 })
      .to(this.arm, 0.15, { rotation: -20 })
      .to(this.arm, 0.15, { rotation: 0 })
      .to(this.arm, 0.15, { rotation: -20 })
      .to(this.arm, 0.15, { rotation: 0 })
      .to(this.arm, 0.15, { rotation: -20 })
      .to(this.arm, 0.15, { rotation: 0 });

    t
      .addLabel('start')
      .set(this.appleGuy, { opacity: 1, immediateRender: false }, 'start')
      .set(this.appleSvg, { y: '125%', autoAlpha: 1, transformOrigin: 'center' })
      .set(this.arm, { rotation: -20, transformOrigin: 'left center' })
      .set(eyes, { xPercent: -50 })
      .to(this.appleSvg, 0.75, { y: '60%', ease: 'Power4.easeOut' })
      .addLabel('eyes')
      .to(eyes, 0.15, { xPercent: -110, ease: 'Power2.easeOut' }, 'eyes+=0.3')
      .to(eyes, 0.15, { xPercent: 0, ease: 'Power2.easeOut' }, 'eyes+=1.3')
      .to(this.appleSvg, 1, { yPercent: 0, ease: 'Power4.easeInOut' }, 'eyes+=2.25')
      .add(wave, 'eyes+=3')
      .set(this.appleGuy, { opacity: 1 }, '+=2'); // delay
    // .to(this.appleSvg, 0.75, { y: '125%', ease: 'Power4.easeOut' }, '+=0.5');

    return t;
  }

  render() {

    return (
      <div className="appleGuy" ref={(el) => { this.appleGuy = el; }}>
        <svg className="appleGuy__svg" ref={(el) => { this.appleSvg = el; }} viewBox="0 0 132 200">
          <g fill="#402312">
            <path ref={(el) => { this.arm = el; }} d="M110.2 172.6c-.5 0-.9 0-1.3-.1-7.4-1.4-9.2-10.7-9.2-11.1-.2-.9.5-1.9 1.4-2 .9-.2 1.8.5 2 1.4 0 .1 1.4 7.4 6.5 8.3 1.9.4 3.8-.8 5.8-3.6 1.6-2.3 2.5-4.7 2.5-4.8.3-.9 1.3-1.4 2.2-1 .9.3 1.4 1.3 1 2.2 0 .1-1.1 2.9-3 5.6-2.8 4.1-5.7 5.1-7.9 5.1z" />

            <path d="M34.3 189.8c-1 0-1.7-.8-1.7-1.7 0-.3 0-7.5 1.9-12.8 3.5-9.5 7.4-11.7 7.8-11.9l1.5 3.1s-3.2 1.9-6.1 10C36 181.2 36 188 36 188.1c0 1-.8 1.7-1.7 1.7z" />
            <path d="M63 200h-4.8c-1 0-1.7-.8-1.7-1.7 0-1 .8-1.7 1.7-1.7h2.9l-2.2-24.2c-.1-1 .6-1.8 1.6-1.9 1-.1 1.8.6 1.9 1.6l2.4 26.2c0 .5-.1 1-.4 1.3-.4.2-.9.4-1.4.4z" />
            <path d="M77.5 200h-4.8c-.5 0-1-.2-1.3-.6-.3-.4-.5-.8-.4-1.3l2.4-26.2c.1-1 .9-1.7 1.9-1.6 1 .1 1.7.9 1.6 1.9l-2.2 24.2h2.9c1 0 1.7.8 1.7 1.7-.1 1.1-.8 1.9-1.8 1.9z" />
            <path d="M64.9 57.4V57c0-.3.1-.6.1-1.1.1-.9.3-2.3.7-3.9.2-.8.4-1.7.7-2.6.3-.9.6-1.8.9-2.8.4-1 .7-2 1.2-2.9.4-1 .9-2 1.5-3s1.2-1.9 1.8-2.8c.2-.2.3-.5.5-.7.2-.2.3-.4.5-.6.2-.2.3-.4.5-.6.2-.2.4-.4.5-.6.4-.4.7-.8 1.1-1.1.4-.4.8-.7 1.1-1 .4-.3.8-.6 1.1-.9.2-.1.4-.3.6-.4.2-.1.4-.2.6-.4.7-.5 1.5-.9 2.1-1.2.6-.3 1.2-.6 1.7-.8l1.5-.6c1.5-.6 3.1.2 3.7 1.7.5 1.5-.2 3.2-1.7 3.7-.1 0-.1 0-.2.1l-.2.1-1.2.3c-.4.1-.8.3-1.3.5s-1.1.5-1.6.8c-.1.1-.3.2-.5.2-.2.1-.3.2-.5.3l-.9.6c-.3.2-.6.5-1 .7-.3.3-.6.5-1 .8l-.5.5-.5.5-.5.5c-.1.2-.3.4-.4.5-.6.7-1.2 1.5-1.7 2.3-.5.8-1 1.6-1.5 2.5-.5.8-.9 1.7-1.2 2.6-.4.9-.7 1.7-1 2.5-.3.8-.5 1.6-.8 2.3-.4 1.4-.7 2.7-.9 3.5-.1.4-.1.8-.2 1 0 .2-.1.3-.1.3v.1c-.2.9-1 1.6-2 1.4-.5-.1-1.1-1-1-1.9z" />
          </g>

          <ellipse cx="84.8" cy="31.7" fill="#43BC9F" rx="3" ry="3" />
          <path fill="#FFD544" d="M88.3 51.3c-10.7 0-13.6 5.2-21.7 5.2s-11-5.2-21.7-5.2C13.3 51.3 1 89 1 107.1c0 34.6 27.4 67 65.6 67 38.2 0 64.4-32.5 64.4-67 0-18.1-11.2-55.8-42.7-55.8z" />
          <path fill="#0077BF" d="M45.3 27.8C35.7 18.1 37.8.2 37.8.2S55.6-2 65.2 7.7s7.5 27.6 7.5 27.6-17.8 2.2-27.4-7.5z" />
          <path fill="#402312" d="M64.4 114.2c-5.4 0-10.2-3.1-12.6-8-.5-1-.1-2.3 1-2.8 1-.5 2.3-.1 2.8 1 1.7 3.5 5.1 5.6 8.9 5.6 3.8 0 7.2-2.2 8.9-5.6.5-1 1.7-1.5 2.8-1 1 .5 1.5 1.7 1 2.8-2.6 4.9-7.4 8-12.8 8z" />

          <path fill="#FFFBF1" d="M89.5 99.4h-8c-3.4 0-6.1-2.7-6.1-6.1v-.1c0-3.4 2.7-6.1 6.1-6.1h8c3.4 0 6.1 2.7 6.1 6.1v.1c0 3.4-2.7 6.1-6.1 6.1z" />
          <path fill="#FFFBF1" d="M47.8 99.4h-8c-3.4 0-6.1-2.7-6.1-6.1v-.1c0-3.4 2.7-6.1 6.1-6.1h8c3.4 0 6.1 2.7 6.1 6.1v.1c-.1 3.4-2.8 6.1-6.1 6.1z" />

          <g ref={(el) => { this.eyes = el; }}>
            <path fill="#402312" d="M94.3 89.5c-.9-.9-2.2-1.4-3.5-1.4-2.9 0-5.2 2.4-5.2 5.3s2.3 5.3 5.2 5.3c1 0 1.9-.3 2.7-.8 1.3-1.1 2.1-2.8 2.1-4.6 0-1.4-.5-2.7-1.3-3.8z" />
            <path fill="#402312" d="M52.5 89.5c-.9-.9-2.2-1.4-3.5-1.4-2.9 0-5.2 2.4-5.2 5.3s2.3 5.3 5.2 5.3c1 0 1.9-.3 2.7-.8 1.3-1.1 2.1-2.8 2.1-4.6 0-1.4-.5-2.7-1.3-3.8z" />
          </g>
        </svg>
      </div>
    );
  }
}
