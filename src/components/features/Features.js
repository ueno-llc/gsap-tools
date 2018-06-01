import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Features.css';

export default class Features extends PureComponent {

  static propTypes = {
    heading: PropTypes.node,
    children: PropTypes.node,
  }

  render() {
    const { heading, children } = this.props;

    return (
      <div className="features">
        {heading}

        <ul className="features__row">
          {Children.map(children, child => (
            <li className="features__item">
              {child}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
