import React, { PureComponent, cloneElement } from 'react';
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
          {getChildren(master).map(({ data }, i) => (
            <li
              className={s.timeline__row}
              key={i} // eslint-disable-line
            >
              {cloneElement(data.target, {
                className: s.timeline__target,
              })}

              <div
                className={s.timeline__item}
                style={{ marginLeft: this.getStyle(data).marginLeft }}
              >
                <div className={s.timeline__infos}>
                  <p className={s.timeline__properties}>{data.properties}</p>
                  <p className={s.timeline__duration}>{data.duration}s</p>
                </div>

                <div
                  className={s.timeline__bar}
                  style={{ width: this.getStyle(data).width }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div
          className={s.timeline__grid}
          ref={(el) => { this.grid = el; }}
        />
      </div>
    );
  }
}
