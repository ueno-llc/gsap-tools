import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
      </div>
    );
  }
}
