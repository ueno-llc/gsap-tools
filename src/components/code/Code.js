import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-syntax-highlighter/prism';

import outdent from 'utils/outdent';
import style from 'utils/highlighter';

import './Code.css';

export default class Code extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
  }

  render() {
    const { children, title } = this.props;

    return (
      <section className="code">
        <h2 className="code__heading">{title}</h2>

        <Highlighter
          language="javascript"
          style={style}
          className="code__inner"
        >
          {outdent(children)}
        </Highlighter>
      </section>
    );
  }
}
