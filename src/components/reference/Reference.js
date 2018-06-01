import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Reference.css';

export default class Reference extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className="reference">
        {children}
      </div>
    );
  }
}
