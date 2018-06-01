import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Icon.css';

export default class Icon extends PureComponent {

  static propTypes = {
    color: PropTypes.string,
    image: PropTypes.node,
  }

  render() {
    const { color, image } = this.props;

    return (
      <div className="icon" style={{ backgroundColor: color }}>
        {image && <span className="icon__image">{image}</span>}
      </div>
    );
  }
}
