import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Code.css';

export default class Code extends PureComponent {

  state = {
    text: this.props.children,
  }

  static propTypes = {
    children: PropTypes.node,
  }

  static propTypes = {
    visible: PropTypes.bool,
  }

  static defaultProps = {
    visible: true,
  }

  extractString = (str) => {
    const result = [];

    if (/'/.test(str)) {
      result.push(str.match(/'(.*?)'/g));
    }

    return result;
  }

  highlight = () => {
    const strings = [];

    let t = this.props.children.toString() || '';
    const keywords = ['this', 'true', 'false', 'from', 'import', 'await', 'extends', 'break', 'let'];
    const functions = ['componentDidMount(', 'disposer(', 'add(', 'componentWillUnmount('];
    const symbols = ['{', '}', '(', ')', ' = '];

    if (/'/.test(t)) {
      strings.push(t.match(/'(.*?)'/g));
    }

    for (let i = 0; i < keywords.length; i++) {
      t = t.split(keywords[i]).join(`<span class="code__yellow">${keywords[i]}</span>`);
    }

    for (let i = 0; i < functions.length; i++) {
      t = t.split(functions[i]).join(`<span class="code__blue">${functions[i]}</span>`);
    }

    for (let i = 0; i < symbols.length; i++) {
      t = t.split(symbols[i]).join(`<span class="code__jade">${symbols[i]}</span>`);
    }

    if (strings[0]) {
      for (let i = 0; i < strings[0].length; i++) {
        t = t.split(strings[0][i]).join(`<span class="code__green">${strings[0][i]}</span>`);
      }
    }

    this.setState({ text: t });
  }

  componentDidMount() {
    this.highlight();
  }

  render() {
    const { visible } = this.props;

    const className = visible ? 'code code--visible' : 'code';

    return (
      <pre className={className}>
        <code
          ref={(el) => { this.codeBlock = el; }}
          dangerouslySetInnerHTML={{__html: this.state.text}}
        />
      </pre>
    );
  }
}
