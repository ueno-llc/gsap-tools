import React, { PureComponent } from 'react';

import AppLayout from 'components/app-layout';
import Hero from 'components/hero';
import Content from 'components/content';
import Code from 'components/code';
import H2 from 'components/h2';
import Copy from 'components/copy';
import Features, { Item as FeaturesItem, Icon } from 'components/features';

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

          <Features heading={
            <H2>Features</H2>
          }>
            <FeaturesItem
              icon={
                <Icon
                  color="#1de1af"
                  image={
                    <svg width="11" height="14">
                      <path d="M1.4.1L10.1 6c.4.3.5.8.3 1.2 0 .1-.1.2-.2.2l-8.8 5.9c-.4.3-.9.2-1.2-.2-.2-.2-.2-.3-.2-.5V.9C0 .4.4 0 .9 0c.1 0 .3 0 .5.1z" />
                    </svg>
                  }
                />
              }
              title="Play/pause"
              text="No more refreshing, just pause and play your timelines as much as you want."
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#3ec2f2"
                  image={
                    <svg width="15" height="18">
                      <path d="M14.5 2.9L12.1.3c-.2-.3-.7-.3-1-.1-.3.3-.4.8-.1 1.1l1.1 1.3H6.6C3.1 2.6.4 5.4.4 8.8c0 .5.3.8.8.8s.8-.3.8-.8c0-2.6 2.1-4.7 4.7-4.7h5.7L11 5.5c-.3.3-.2.8.1 1.1.1.2.3.2.6.2.2 0 .4-.1.6-.2L14.5 4c.3-.4.3-.8 0-1.1zM13.7 7.7c-.5 0-.8.3-.8.8 0 2.6-2.1 4.7-4.7 4.7H2.5l1.3-1.3c.3-.3.2-.8-.1-1.1-.3-.3-.8-.2-1.1.1L.2 13.5c-.2.3-.2.8 0 1l2.4 2.6c.1.2.3.3.6.3.2 0 .4-.1.6-.2.2-.4.2-.8 0-1.2l-1.1-1.3h5.5c3.5 0 6.2-2.8 6.2-6.2 0-.4-.3-.8-.7-.8z" />
                    </svg>
                  }
                />
              }
              title="Loop"
              text="Want to see your animations severals times? Just loop loop, that’s it."
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#aa80fe"
                  image={
                    <svg width="12" height="13">
                      <path d="M11.1 11.4c0 .2-.1.5-.2.7-.4.6-1.2.7-1.7.3L1.5 7.3 1.2 7v4.2c0 .4-.2.6-.6.6s-.6-.2-.6-.6V1.1C0 .7.2.5.6.5s.6.2.6.6v4.5l.3-.3L9.1.2c.2-.1.5-.2.7-.2.7 0 1.2.6 1.2 1.2v10.2z" />
                    </svg>
                  }
                />}
              title="Rewind"
              text="We all want to repeat good things, right? Press the rewind button then, yeah it looks nice!"
            />

            <FeaturesItem
            icon={
              <Icon
                color="#f79800"
                image={
                  <svg width="8" height="14">
                    <path d="M4.6 13.8c-.3.3-.7.3-1 0L0 10.3V.8C0 .3.3 0 .8 0h6.4c.5 0 .8.3.8.8v9.6l-3.4 3.4z" />
                  </svg>
                }
              />}
              title="In/out markers"
              text="Want to repeat a specific part of timeline? Just define in/out markers and you’re good to go."
            />

            <FeaturesItem
            icon={
              <Icon
                color="#ff5350"
                image={
                  <svg width="26" height="14">
                    <path d="M2.6 2.1L7 5v2.9l-4.4 3c-.5.3-1.1.2-1.4-.3-.2-.2-.2-.4-.2-.6l.1-7c0-.6.5-1 1-1 .2 0 .4 0 .5.1z" opacity=".6"/>
                    <path d="M8.5 1.6l6.9 4.7c.5.3.6.9.3 1.4l-.3.3-6.8 4.5c-.5.3-1.1.2-1.4-.3-.1-.2-.1-.4-.2-.6l-.1-9.2c0-.6.4-1 1-1 .2 0 .4.1.6.2z" opacity=".8"/>
                    <path d="M16.6.3l8.7 5.8c.5.3.6.9.3 1.4l-.3.3-8.8 5.9c-.5.3-1.1.2-1.4-.3-.1-.2-.1-.4-.1-.6l.1-11.7c0-.6.5-1 1-1 .2.1.4.1.5.2z"/>
                  </svg>
                }
              />}
              title="Timescale"
              text="Speed up, slow down, feel free to play with them as much as you want."
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#1de1af"
                  image={
                    <svg width="24" height="25">
                    <g fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12.3 3v19.1" />
                      <path d="M19.8 15.9l3.1-3.4-3.1-3.3M4.9 15.9l-3.1-3.4 3.1-3.3M15.7 20l-3.4 3L9 20m6.7-15.3l-3.4-3-3.3 3" />
                      <path d="M22.1 12.5H3.2" />
                    </g>
                    </svg>
                  }
                />
              }
              title="Play/pause"
              text="No more refreshing, just pause and play your timelines as much as you want."
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#3ec2f1"
                />
              }
              title="Updated timelines"
              text="You can navigate between pages, GsapTools will be updated with the active timelines."
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#ab80ff"
                />
              }
              title="TimelineLite and TimelineMax ready"
              text="We currently only support animations for these two GSAP functions."
            />

          </Features>

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

            The simplest way to do it is to define an id on the Timeline method constructor,
            call the 'add' function to register the timeline, and create a reference to the add function
            to remove it when the component is unmounted. Alternatively, there are other ways to do
            it. <button onClick={this.showCode}>View them</button>.</p>

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
