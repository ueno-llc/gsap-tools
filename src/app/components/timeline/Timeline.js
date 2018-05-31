import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Timeline.scss';

export default class Timeline extends PureComponent {

  static propTypes = {
    isExpanded: PropTypes.bool,
  }

  render() {
    const { isExpanded } = this.props;

    return (
      <div className={s(s.timeline, { isExpanded })}>
        <ul className={s.timeline__list}>
          {Array(10).fill(0).map(() => (
            <li className={s.timeline__row}>
              <p className={s.timeline__target}>.heading</p>

              <div className={s.timeline__item}>
                <div className={s.timeline__infos}>
                  <p className={s.timeline__properties}>Opacity, scale</p>
                  <p className={s.timeline__duration}>2s</p>
                </div>

                <div className={s.timeline__bar} />
              </div>
            </li>
          ))}
        </ul>

        <div className={s.timeline__grid} />
      </div>
    );
  }
}
