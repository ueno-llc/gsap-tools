import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { atomDark } from 'react-syntax-highlighter/styles/prism';

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
        <SyntaxHighlighter
          language="javascript"
          style={atomDark}
          className="code__inner"
        >
          {children}
        </SyntaxHighlighter>
      </section>
    );
  }
}
