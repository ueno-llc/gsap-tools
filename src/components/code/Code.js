import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/styles/hljs';

import './Code.css';

export default class Code extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <SyntaxHighlighter
        language="javascript"
        style={github}
        className="code"
      >
        {children}
      </SyntaxHighlighter>
    );
  }
}
