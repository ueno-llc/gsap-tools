import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Button.scss';

export default class Button extends PureComponent {

  static propTypes = {
    isVisible: PropTypes.bool,
    isLoaded: PropTypes.bool,
    onUIClose: PropTypes.func,
    onClick: PropTypes.func,
  }

  render() {
    const { isVisible, isLoaded, onUIClose, onClick } = this.props;

    // We don't want to show the default build-in button, if user
    // chose to pass his own inClick function
    if (onClick) {
      return null;
    }

    return (
      <button
        className={s(s.button, { isVisible, isLoaded })}
        onClick={onUIClose}
      >
        GSAP
      </button>
    );
  }
}
