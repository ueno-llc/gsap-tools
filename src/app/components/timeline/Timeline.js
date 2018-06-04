/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import getChildren from 'utils/getChildren';

import s from './Timeline.scss';

const GRID_WIDTH = 754;

export default class Timeline extends PureComponent {

  static propTypes = {
    master: PropTypes.object,
    isExpanded: PropTypes.bool,
  }

  get totalDuration() {
    const { master } = this.props;

    return master.totalDuration();
  }

  getStyle = ({ start, duration }) => {
    const marginLeft = (GRID_WIDTH * start) / this.totalDuration;
    const width = (GRID_WIDTH * duration) / this.totalDuration;

    return {
      marginLeft,
      width,
    };
  }

  render() {
    const { master, isExpanded } = this.props;

    return (
      <div className={s(s.timeline, { isExpanded })}>
        <ul className={s.timeline__list}>
          {getChildren(master).map((data, i) => {
            const { target } = data;
            const selector = target.join('');
            const noTarget = target.length === 0;

            return (
              <li
                className={s(s.timeline__row, { isSet: data.isSet })}
                key={i}
              >
                <div className={s.timeline__left}>
                  {!noTarget && (
                    <p className={s.timeline__leftTooltip}>{selector}</p>
                  )}

                  <p className={s.timeline__target}>
                    {noTarget
                      ? '...'
                      : target.map((d, ii) => <span key={ii}>{d}</span>)}
                  </p>
                </div>

                <div
                  className={s.timeline__item}
                  style={{ marginLeft: this.getStyle(data).marginLeft }}
                >
                  <p className={s.timeline__itemTooltip}>{data.properties}</p>

                  <div className={s.timeline__infos}>
                    <p
                      className={s.timeline__properties}
                      style={{ width: this.getStyle(data).width }}
                    >
                      {data.properties}
                    </p>
                  </div>

                  <div className={s.timeline__wrapper}>
                    <div
                      className={s.timeline__bar}
                      style={{ width: this.getStyle(data).width }}
                    />

                    <p
                      className={s.timeline__duration}
                      style={{ left: this.getStyle(data).width + 6 }}
                    >
                      {data.isSet ? 'SET' : `${data.duration.toFixed(2)}s`}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div
          className={s.timeline__grid}
          ref={(el) => { this.grid = el; }}
        />
      </div>
    );
  }
}
