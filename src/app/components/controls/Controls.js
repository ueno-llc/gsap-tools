import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Controls.scss';

export default class Controls extends PureComponent {

  static propTypes = {
    isPause: PropTypes.bool,
    isLoop: PropTypes.bool,
    isActive: PropTypes.bool,
    isExpanded: PropTypes.bool,
    isReversed: PropTypes.bool,
    onReverse: PropTypes.func,
    onPlayPause: PropTypes.func,
    onLoop: PropTypes.func,
  }

  render() {
    const {
      isPause,
      isLoop,
      isActive,
      isExpanded,
      isReversed,
      onReverse,
      onPlayPause,
      onLoop,
    } = this.props;

    return (
      <div className={s(s.controls, { isLoop, isActive, isExpanded, isReversed })}>
        <div className={s.controls__container}>
          <button className={s.controls__reverse} onClick={onReverse}>
            <svg width="18.9" height="18.8">
              <path d="M3.2,8.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3C5,8,5,7.4,4.7,7L3.2,5.4h14.5c0.6,0,1-0.4,1-1s-0.4-1-1-1H3.2l1.5-1.7c0.4-0.4,0.3-1-0.1-1.4S3.6,0,3.2,0.4l-3,3.3c-0.3,0.4-0.3,1,0,1.3L3.2,8.4z" />
              <path d="M18.6,13.7l-3-3.3c-0.4-0.4-1-0.4-1.4-0.1c-0.4,0.4-0.4,1-0.1,1.4l1.5,1.7H1.2c-0.6,0-1,0.4-1,1s0.4,1,1,1h14.5l-1.5,1.7c-0.4,0.4-0.3,1,0.1,1.4c0.2,0.2,0.4,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3-3.3C19,14.7,19,14.1,18.6,13.7z" />
            </svg>
          </button>

          <button className={s.controls__playPause} onClick={onPlayPause}>
            {isPause ? (
              <svg width="24.5" height="31.4" viewBox="0 0 24.5 31.4">
                <path d="M3.2,0.3L23.6,14c0.9,0.6,1.2,1.9,0.6,2.8c-0.1,0.2-0.3,0.4-0.5,0.5L3.1,31c-0.9,0.6-2.2,0.4-2.8-0.5C0.1,30.1,0,29.8,0,29.4V2c0-1.1,0.9-2,2-2C2.4,0,2.9,0.1,3.2,0.3z" />
              </svg>
            ) : (
              <svg width="17" height="31" viewBox="0 0 17 31">
                <path d="M14.5,0C13.1,0,12,1.1,12,2.5v26c0,1.4,1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5v-26C17,1.1,15.9,0,14.5,0z" />
                <path d="M2.5,0C1.1,0,0,1.1,0,2.5v26C0,29.9,1.1,31,2.5,31S5,29.9,5,28.5v-26C5,1.1,3.9,0,2.5,0z" />
              </svg>
            )}
          </button>

          <button className={s.controls__loop} onClick={onLoop}>
            <svg width="18.7" height="22" viewBox="0 0 18.7 22">
              <path d="M18.4,3.7l-3-3.3c-0.4-0.4-1-0.4-1.4-0.1c-0.4,0.4-0.4,1-0.1,1.4l1.4,1.6h-7c-4.4,0-7.9,3.6-7.9,7.9c0,0.6,0.4,1,1,1s1-0.4,1-1c0-3.3,2.7-5.9,5.9-5.9h7.2L13.9,7c-0.4,0.4-0.3,1,0.1,1.4c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3l3-3.3C18.7,4.6,18.7,4,18.4,3.7z" />
              <path d="M17.3,9.8c-0.6,0-1,0.4-1,1c0,3.3-2.7,5.9-5.9,5.9H3.2L4.8,15c0.4-0.4,0.3-1-0.1-1.4s-1-0.3-1.4,0.1l-3,3.3c-0.3,0.4-0.3,1,0,1.3l3,3.3C3.5,21.9,3.8,22,4,22c0.2,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0.1-1.4l-1.4-1.6h7c4.4,0,7.9-3.6,7.9-7.9C18.3,10.3,17.8,9.8,17.3,9.8z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}
