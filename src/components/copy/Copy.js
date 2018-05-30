import React from 'react';
import PropTypes from 'prop-types';

import './Copy.css';

const Copy = ({ children }) => (
  <div className="copy">
    {children}
  </div>
);

Copy.propTypes = {
  children: PropTypes.node,
};

Copy.defaultProps = {
  children: undefined,
};

export default Copy;
