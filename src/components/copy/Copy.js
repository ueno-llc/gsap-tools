import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Copy.css';

export default class Copy extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className="copy">
        {children}
      </div>
    );
  }
}
