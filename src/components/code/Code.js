import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-syntax-highlighter/prism';

import outdent from 'utils/outdent';
import style from 'utils/highlighter';

import './Code.css';

export default class Code extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    visible: true,
  }

  render() {
    const { children, visible } = this.props;

    const className = visible ? "code code--visible" : "code";

    return (
      <section className={className}>
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
