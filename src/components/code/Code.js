import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-syntax-highlighter/prism';

import outdent from 'utils/outdent';
import style from 'utils/highlighter';

import './Code.css';

export default class Code extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <section className="code">
        <Highlighter
          language="javascript"
          style={style}
        >
          {outdent(children)}
        </Highlighter>
      </section>
    );
  }
}
