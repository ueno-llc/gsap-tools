import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Button.scss';

export default class Button extends PureComponent {

  static propTypes = {
    buttonRef: PropTypes.func,
    visible: PropTypes.bool,
    onClick: PropTypes.func,
    handleUIClose: PropTypes.func,
  }

  render() {
    const { buttonRef, visible, onClick, handleUIClose } = this.props;

    if (onClick) {
      return null;
    }

    return (
      <button
        className={s(s.button, { visible })}
        onClick={handleUIClose}
        ref={buttonRef}
      >
        GSAP
      </button>
    );
  }
}
