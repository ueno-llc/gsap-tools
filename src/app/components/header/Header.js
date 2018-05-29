import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import round from 'utils/round';
import { SPEEDS } from 'utils/constants';

import s from './Header.scss';

export default class Header extends PureComponent {

  static propTypes = {
    onMouseDown: PropTypes.func,
    keys: PropTypes.array,
    handleList: PropTypes.func,
    handleTimeScale: PropTypes.func,
    handleUIClose: PropTypes.func,
    master: PropTypes.object,
    timeScale: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    isActive: PropTypes.bool,
  }

  render() {
    const {
      onMouseDown,
      keys,
      handleList,
      handleTimeScale,
      handleUIClose,
      master,
      timeScale,
      isActive,
    } = this.props;

    return (
      <header // eslint-disable-line
        className={s.header}
        onMouseDown={onMouseDown}
      >
        {isActive ? (
          <div className={s.header__list}>
            <select className={s.header__select} onChange={handleList}>
              {keys.map((g, i) => (
                <option
                  key={i} // eslint-disable-line
                  value={g}
                >
                  {g}
                </option>
              ))}
            </select>

            <svg className={s.header__arrowDown} width="11" height="5.6" viewBox="0 0 11 5.6">
              <path fill="#fff" d="M10.8,0.9l-5,4.6C5.7,5.6,5.6,5.6,5.5,5.6s-0.2,0-0.3-0.1l-5-4.6C0,0.7-0.1,0.4,0.1,0.2c0.2-0.2,0.5-0.2,0.7,0l4.7,4.3l4.7-4.3c0.2-0.2,0.5-0.2,0.7,0C11.1,0.4,11,0.7,10.8,0.9z" />
            </svg>
          </div>
        ) : (
          <div className={s(s.header__select, s.header__selectEmpty)}>No timeline</div>
        )}

        <div className={s.header__duration}>
          {(isActive && master) && (
            <div>
              <span>{round(master.time())}</span> / {round(master.totalDuration())}
            </div>
          )}
        </div>

        {isActive && (
          <select
            className={s.header__scale}
            onChange={handleTimeScale}
            value={Number(timeScale)}
          >
            {SPEEDS.map(speed => <option key={speed} value={speed}>{speed}x</option>)}
          </select>
        )}

        <button className={s.header__cross} onClick={handleUIClose}>
          <svg width="11" height="11">
            <path fill="#fff" d="M10.9,10.1c0.2,0.2,0.2,0.5,0,0.7C10.8,11,10.6,11,10.5,11s-0.3,0-0.4-0.1L5.5,6.2l-4.6,4.6C0.8,11,0.6,11,0.5,11s-0.3,0-0.4-0.1c-0.2-0.2-0.2-0.5,0-0.7l4.6-4.6L0.1,0.9C0,0.7,0,0.3,0.1,0.1s0.5-0.2,0.7,0l4.6,4.6l4.6-4.6c0.2-0.2,0.5-0.2,0.7,0s0.2,0.5,0,0.7L6.2,5.5L10.9,10.1z" />
          </svg>
        </button>
      </header>
    );
  }
}
