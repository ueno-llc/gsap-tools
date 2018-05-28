import React from 'react';
import PropTypes from 'prop-types';

import './Item.css';

const Item = ({ icon, title, text }) => (
  <div className="item">
    <div className="item__icon">
      {icon}
    </div>
    <h3 className="item__heading">{title}</h3>
    <p className="item__copy">{text}</p>
  </div>
);

Item.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  text: PropTypes.string,
};

export default Item;
