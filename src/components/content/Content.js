import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Container from '../../components/container';
import Row from '../../components/row';

import './Content.css';

export default class Content extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    subheading: PropTypes.string,
    text: PropTypes.string,
  }

  static defaultProps = {
    children: undefined,
  }

  render() {
    const { children, title, subheading, text } = this.props;

    return (
      <div className="content">
        <Container>
          <Row>
            <div className="content__col">
              <div className="content__inner">
                <h1 className="content__heading">{title}</h1>
                <h2 className="content__subheading">{subheading}</h2>
                <p className="content__copy">{text}</p>
                {children}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}
