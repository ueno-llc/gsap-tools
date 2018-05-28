import React, { PureComponent } from 'react';

import AppLayout from 'components/app-layout';
import Hero from 'components/hero';
import Content from 'components/content';
import Code from 'components/code';
import H2 from 'components/h2';
import Copy from 'components/copy';

export default class App extends PureComponent {

  state = {
    codeVisible: false,
  }

  showCode = () => {
    this.setState({
      codeVisible: !this.state.codeVisible,
    });
  }

  render() {
    return (
      <AppLayout>
        <Hero />

        <Content
          title="GsapTools"
          subheading="A simple way to debug GSAP's timelines"
          text="The Ueno color palette is bright and fancy. And all the colors match.
          Except one. But we won’t tell you which one. Because we’re not about
          to give away all our secrets. You must understand."
        >

          <H2>Installation</H2>

          <Code>
            {`npm install --save-dev gsap-tools`}
          </Code>

          <H2>Features</H2>

          <H2>How to use it</H2>

          <Copy>

            <p>
              <b>Add GsapTools component globally to your application</b>
              <br />You only need to add it once.
            </p>

          </Copy>

          <Code>
            {`import GsapTools from 'gsap-tools';

            <GsapTools />`}
          </Code>

          <Copy>
            <p><b>Register your Gsap timeline to be controlled with GsapTools</b><br />

            The simplest way to do it, is to define an id on the Timeline method constructor,
            call the add function to register the timeline and create a reference to the add function
            to remove it when the component is unmounted. Alternatively, there is other ways to do
            it, <button onClick={this.showCode}>expand them</button>.</p>

          </Copy>

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

          <Code visible={this.state.codeVisible}>
            {`import { add } from 'gsap-tools';

            componentDidMount() {
              this.t = new TimelineLite({ id: 'myTimeline' });

              this.disposer = add(this.t);
            }

            componentWillUnmount() {
              this.disposer();
            }`}
          </Code>



        </Content>
      </AppLayout>
    );
  }
}
