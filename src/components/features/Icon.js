import React from 'react';
import PropTypes from 'prop-types';

import './Icon.css';

const Icon = ({ color, image }) => (
  <div className="icon" style={{ backgroundColor: color }}>
    { image && (
      <span className="icon__image">{image}</span>
    )}
  </div>
);

Icon.propTypes = {
  color: PropTypes.string,
  image: PropTypes.node,
};

export default Icon;
