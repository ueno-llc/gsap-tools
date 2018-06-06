import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Item.css';

export default class Item extends PureComponent {

  static propTypes = {
    icon: PropTypes.node,
    title: PropTypes.string,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  render() {
    const { icon, title, text } = this.props;

    return (
      <div className="item">
        <div className="item__icon">
          {icon}
        </div>

        <h3 className="item__heading">{title}</h3>
        <p className="item__copy">{text}</p>
      </div>
    );
  }
}
