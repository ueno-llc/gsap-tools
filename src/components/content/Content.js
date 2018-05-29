import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Container from 'components/container';
import Row from 'components/row';

import './Content.css';

export default class Content extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    subheading: PropTypes.string,
    text: PropTypes.string,
    hasBackground: PropTypes.bool,
  }

  static defaultProps = {
    children: undefined,
  }

  render() {
    const { hasBackground, children, title, subheading, text } = this.props;

    const className = hasBackground ? 'content content--hasBackground' : 'content';

    return (
      <div className={className}>
        <Container>
          <Row>
            <div className="content__col">
              <div className="content__inner">
                <h1 className="content__heading">{title}</h1>
                <p className="content__subheading">{subheading}</p>
                { text && (
                  <p className="content__copy">{text}</p>
                )}
                {children}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}
