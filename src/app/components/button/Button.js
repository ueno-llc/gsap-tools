import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Button.scss';

export default class Button extends PureComponent {

  static propTypes = {
    buttonRef: PropTypes.func,
    visible: PropTypes.bool,
    onClick: PropTypes.func,
  }

  render() {
    const { buttonRef, visible, onClick } = this.props;

    if (onClick) {
      return null;
    }

    return (
      <div
        className={s(s.button, { visible })}
        ref={buttonRef}
      >
        GSAP
      </div>
    );
  }
}
