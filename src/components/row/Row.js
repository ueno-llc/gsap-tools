import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Row.css';

export default class Row extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className="row">
        {children}
      </div>
    );
  }
}
