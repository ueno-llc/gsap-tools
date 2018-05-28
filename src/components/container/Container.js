import React from 'react';
import PropTypes from 'prop-types';

import './Container.css';

const Container = ({ children }) => (
  <div className="container">
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node,
};

Container.defaultProps = {
  children: undefined,
};

export default Container;
