import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Code.css';

export default class Code extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    visible: true,
  }

  state = {
    text: this.props.children,
  }

  componentDidMount() {
    this.highlight();
  }

  format = (t, array, color) => {
    let text = t;

    for (let i = 0; i < array.length; i++) {
      text = text.split(array[i]).join(`<span class="code__${color}">${array[i]}</span>`);
    }

    return text;
  }

  highlight = () => {
    const keywords = ['this', 'true', 'false', 'from', 'import', 'extends', 'let'];
    const functions = ['componentDidMount(', 'disposer(', 'add(', 'remove(', 'componentWillUnmount('];
    const symbols = ['{', '}', '(', ')', ' = ', '&lt;', '/&gt;', '-'];
    const classes = ['TimelineLite', 'TimelineMax'];
    const numbers = [1, 50];

    let t = this.props.children.toString();

    t = this.format(t, keywords, 'pink');
    t = this.format(t, functions, 'blue');
    t = this.format(t, symbols, 'jade');
    t = this.format(t, classes, 'yellow');
    t = this.format(t, numbers, 'red');

    // find single-quoted strings
    let strings;

    if (/'/.test(t)) {
      strings = (t.match(/'(.*?)'/g));
    }

    if (strings) {
      t = this.format(t, strings, 'green');
    }

    // wrap comment lines
    const lines = t.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const strip = (lines[i].replace(/\s/g, ''));
      const sub = strip.substring(0, 2);

      if (sub === '//' || sub.includes('*')) {
        lines[i] = `<span class="code__grey">${lines[i]}</span>`;
      }
    }

    t = lines.join('\n');

    this.setState({ text: t });
  }

  render() {
    const { visible } = this.props;
    const { text } = this.state;

    return (
      <pre className={classnames('code', { 'code--visible': visible })}>
        <code
          // eslint-disable-next-line
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </pre>
    );
  }
}
