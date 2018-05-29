import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Button.scss';

export default class Button extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    onClick: PropTypes.func,
    loaded: PropTypes.bool,
    handleUIClose: PropTypes.func,
  }

  render() {
    const { visible, onClick, loaded, handleUIClose } = this.props;

    if (onClick) {
      return null;
    }

    return (
      <button
        className={s(s.button, { visible, loaded })}
        onClick={handleUIClose}
      >
        GSAP
      </button>
    );
  }
}
