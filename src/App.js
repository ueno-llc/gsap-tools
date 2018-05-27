import React, { PureComponent } from 'react';

import AppLayout from './components/app-layout';

import Hero from './components/hero';
import Content from './components/content';
import GsapTools from 'gsap-tools';

import Code from './components/code';

export default class App extends PureComponent {

  render() {
    return (
      <AppLayout>

        <Hero />

        <Content
          title="Gsap Tools"
          subheading="A simple way to debug GSAP's timelines"
          text="The Ueno color palette is bright and fancy. And all the colors match.
          Except one. But we won’t tell you which one. Because we’re not about
          to give away all our secrets. You must understand."
        >
          <div>hi!</div>
        </Content>

        <GsapTools isVisible isFixed />

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
