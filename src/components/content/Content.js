import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Container from 'components/container';
import Row from 'components/row';

import './Content.css';

export default class Content extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    subheading: PropTypes.string,
    text: PropTypes.node,
    hasBackground: PropTypes.bool,
  }

  render() {
    const { hasBackground, children, title, subheading, text } = this.props;

    return (
      <div className={classnames('content', { 'content--hasBackground': hasBackground })}>
        <Container>
          <Row>
            <div className="content__col">
              <div className="content__inner">
                {title && <h1 className="content__heading">{title}</h1>}
                {subheading && <p className="content__subheading">{subheading}</p>}
                {text && <p className="content__copy">{text}</p>}
                {children}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}
