import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-syntax-highlighter/prism';
import classnames from 'classnames';

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

    return (
      <section className={classnames('code', { 'code--visible': visible })}>
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
