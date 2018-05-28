import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GsapTools from 'gsap-tools'; // eslint-disable-line

import GridOverlay from 'components/grid-overlay';

import './AppLayout.css';

export default class AppLayout extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className="layout">
        {children}

        <GridOverlay />
        <GsapTools isVisible />
      </div>
    );
  }
}
