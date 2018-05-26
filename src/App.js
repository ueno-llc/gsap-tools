import React, { PureComponent } from 'react';

import AppLayout from 'components/app-layout';
import Hero from 'components/hero';
import Content from 'components/content';
import Code from 'components/code';

export default class App extends PureComponent {

  render() {
    return (
      <AppLayout>
        <Hero />

        <Content title="GsapTools" subheading="A simple way to debug GSAP's timelines">
          <div>hi!</div>

          <h2>Installation</h2>

          <Code>
{`npm install --save-dev gsap-tools`}
          </Code>

          <h2>Features</h2>

          <h2>How to use it</h2>

          <p>Add GsapTools component globally to your app (just import it once in your app)</p>

          <Code>
{`import GsapTools from 'gsap-tools';

<GsapTools />`}
          </Code>

          <p>Register your Gsap timeline to be control with GsapTools</p>

          <p>The simple way to do it:
          — You defined an id on the TimelineLite constructor
          — You create a reference to the add function to dispose of the timeline on the componentWillUnmount</p>

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

          <p>Others ways:</p>

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
        </Content>
      </AppLayout>
    );
  }
}
