import React, { PureComponent } from 'react';

import AppLayout from './components/app-layout';
import Header from './components/header';
import Intro from './components/intro';
import Code from './components/code';

export default class App extends PureComponent {

  render() {
    return (
      <AppLayout>
        <Header />
        <Intro />

        <Code>
{`import GsapTools from 'gsap-tools';

<GsapTools />`}
        </Code>

        <Code>
{`import { add } from 'gsap-tools';

componentDidMount() {
  this.t = new TimelineLite({ id: 'myTimeline' });

  this.disposer = add(this.t);
}

componentWillUnmount() {
  this.disposer();
}`}
        </Code>

        <Code>
{`componentDidMount() {
  this.t = new TimelineLite();

  // You can defined the id of the timeline on the 'add' function itself
  add(this.t, 'myTimeline');

  // or

  // It will generated an id, if you don't specified any
  add(this.t);
}

componentWillUnmount() {
  // Remove the timeline just by passing the reference to the timeline
  remove(this.t);

  // or

  // Remove the timeline by passing the id, without the timeline reference
  remove(null, 'myTimeline');
}`}
        </Code>
      </AppLayout>
    );
  }
}
