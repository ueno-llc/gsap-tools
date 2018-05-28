import React from 'react';
import PropTypes from 'prop-types';

import './H2.css';

const H2 = ({ children }) => (
  <h2 className="heading2">{children}</h2>
);

H2.propTypes = {
  children: PropTypes.node,
};

H2.defaultProps = {
  children: undefined,
}

export default H2;
