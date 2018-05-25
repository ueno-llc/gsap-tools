import React, { PureComponent } from 'react';
import { TweenLite } from 'gsap/all';

import logo from '../../logo.svg';

import './Header.css';

export default class Header extends PureComponent {

  componentDidMount() {
    setTimeout(() => {
      if (!this.logo) {
        return;
      }

      TweenLite.fromTo(
        this.logo,
        1,
        { marginLeft: -60, opacity: 0 },
        { marginLeft: 0, opacity: 1, ease: 'Power4.easeInOut' },
      );
    }, 300);
  }

  render() {
    return (
      <header className="header">
        <img
          ref={(el) => { this.logo = el; }}
          src={logo}
          className="header__logo"
          alt="logo"
        />

        <h1 className="header__title">Welcome to React</h1>
      </header>
    );
  }
}
