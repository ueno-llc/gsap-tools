import React, { PureComponent } from 'react';

import AppLayout from './components/app-layout';
import Header from './components/header';
import Intro from './components/intro';

export default class App extends PureComponent {

  render() {
    return (
      <AppLayout>
        <Header />
        <Intro />
      </AppLayout>
    );
  }
}
