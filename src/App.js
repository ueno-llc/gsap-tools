import React, { PureComponent } from 'react';

import AppLayout from './components/app-layout';
import Hero from './components/hero';
import Content from './components/content';
import GsapTools from 'gsap-tools';

export default class App extends PureComponent {

  render() {
    return (
      <AppLayout>

        <Hero />

        <Content title="GsapTools" subheading="A simple way to debug GSAP's timelines">
          <div>hi!</div>
        </Content>

        <GsapTools isVisible isFixed />


      </AppLayout>
    );
  }
}
