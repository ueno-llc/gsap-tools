/* eslint-disable react/jsx-closing-tag-location */

import React, { PureComponent } from 'react';

import AppLayout from 'components/app-layout';
import Hero from 'components/hero';
import Content from 'components/content';
import Code from 'components/code';
import Copy from 'components/copy';
import Features, { Item as FeaturesItem, Icon } from 'components/features';
import Reference from 'components/reference';

export default class App extends PureComponent {

  state = {
    codeVisible: false,
  }

  showCode = () => {
    this.setState({ codeVisible: !this.state.codeVisible });
  }

  render() {
    return (
      <AppLayout>
        <Hero />

        <Content
          hasBackground
          title="GsapTools, by Ueno"
          subheading="A simple tool to debug GSAP animations"
          text="Managing and debugging Tween and Timeline in GSAP is a hassle, even with
          the official dev tools. So we created GsapTools, an extension that makes it all so much
          easier. Click on the GSAP button to see in in action, and scroll down to know more."
        >
          <h2>Installation</h2>

          <Code>
            {'npm install gsap-tools'}
          </Code>

          <Features heading={<h2>Features</h2>}>
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
              text="No more reloading. Pause and play your animations as much as you want."
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
              text="Want to see your animations over and over? Now you can loop, loop, loop."
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
                />
              }
              title="Rewind"
              text="Be kind, rewind. With this fancy button you can do it again and again."
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
                />
              }
              title="In/out markers"
              text="Want to repeat a specific part of an animation? Just define in/out markers and you’re good to go."
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#ff5350"
                  image={
                    <svg width="26" height="14">
                      <path d="M2.6 2.1L7 5v2.9l-4.4 3c-.5.3-1.1.2-1.4-.3-.2-.2-.2-.4-.2-.6l.1-7c0-.6.5-1 1-1 .2 0 .4 0 .5.1z" opacity=".6" />
                      <path d="M8.5 1.6l6.9 4.7c.5.3.6.9.3 1.4l-.3.3-6.8 4.5c-.5.3-1.1.2-1.4-.3-.1-.2-.1-.4-.2-.6l-.1-9.2c0-.6.4-1 1-1 .2 0 .4.1.6.2z" opacity=".8" />
                      <path d="M16.6.3l8.7 5.8c.5.3.6.9.3 1.4l-.3.3-8.8 5.9c-.5.3-1.1.2-1.4-.3-.1-.2-.1-.4-.1-.6l.1-11.7c0-.6.5-1 1-1 .2.1.4.1.5.2z" />
                    </svg>
                  }
                />
              }
              title="Timescale"
              text="Need for speed? Go faster. Take it slow? Go sloooower."
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
              title="Draggable UI"
              text={(<span>“GRRR!! The box is right on top of my
              animation <span style={{ whiteSpace: 'nowrap' }}>:( </span>”.
                Well it isn’t if you just drag it somewhere else.</span>)}
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#3ec2f1"
                  image={
                    <svg width="19.3" height="17">
                      <path d="M19.1,7.3l-1.9,2.5c-0.2,0.3-0.5,0.4-0.8,0.4c-0.2,0-0.4,0-0.5-0.1l-2.7-1.6c-0.5-0.3-0.6-0.9-0.3-1.4c0.3-0.5,0.9-0.6,1.4-0.3l0.8,0.5C14.5,4.3,11.8,2,8.6,2C5,2,2,4.9,2,8.5S5,15,8.6,15c0.6,0,1,0.4,1,1s-0.4,1-1,1C3.9,17,0,13.2,0,8.5C0,3.8,3.9,0,8.6,0c4.1,0,7.6,2.9,8.4,6.7l0.5-0.6c0.3-0.4,1-0.5,1.4-0.2C19.3,6.3,19.4,6.9,19.1,7.3z" />
                    </svg>
                  }
                />
              }
              title="Updated animations"
              text="GsapTools automatically updates active animations when you navigate between pages."
            />

            <FeaturesItem
              icon={
                <Icon
                  color="#ab80ff"
                  image={
                    <svg width="18" height="18">
                      <path d="M7.9,10.1c0.3,0.3,0.3,0.8,0,1.1l-5,5l4,0.2c0.4,0,0.8,0.4,0.8,0.8c0,0.4-0.4,0.8-0.8,0.8c0,0,0,0,0,0L1,17.8c-0.4,0-0.8-0.4-0.8-0.8L0,11.1c0-0.4,0.3-0.8,0.8-0.8c0.4,0,0.8,0.3,0.8,0.8l0.2,4l5-5C7.1,9.8,7.6,9.8,7.9,10.1z M17.8,1c0-0.4-0.4-0.8-0.8-0.8L11.1,0c-0.5,0-0.8,0.3-0.8,0.8c0,0.4,0.3,0.8,0.8,0.8l4,0.2l-4.4,4.4c-0.3,0.3-0.3,0.8,0,1.1c0.2,0.2,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2l4.4-4.4l0.2,4c0,0.4,0.4,0.8,0.8,0.8c0,0,0,0,0,0c0.4,0,0.8-0.4,0.8-0.8L17.8,1z" />
                    </svg>
                  }
                />
              }
              title="Timeline details"
              text="Select 'expand' to view more granular details of the Timeline."
            />
          </Features>

          <h2>How to use it</h2>

          <Copy>
            <p>
              <b>First, add GsapTools component globally to your application.</b> You
              only need to do this once.
            </p>
          </Copy>

          <Code>
            {`import GsapTools from 'gsap-tools';

&lt;GsapTools /&gt;`}
          </Code>

          <Copy>
            <p>
              <b>Next, register your GSAP animation to be controlled with GsapTools.</b><br />
              Define an id on the Timeline constructor or on the Tween vars object, call
              the add function to register the timeline, and create a reference to the
              add function to remove it when the component is unmounted.
            </p>
          </Copy>

          <Code>{`import { add } from 'gsap-tools';

componentDidMount() {
  this.t = new TimelineLite({ id: 'myTimeline' });

  this.disposer = add(this.t);
}

componentWillUnmount() {
  this.disposer();
}
`}
          </Code>

          <Copy>
            <p>
              That’s the simpler version. <button onClick={this.showCode}>Click to show
              an alternative setup.</button>
            </p>
          </Copy>

          <Code visible={this.state.codeVisible}>{`import { add, remove } from 'gsap-tools';

/*
 * With Timeline
 */

componentDidMount() {
  // You can define an id on the Timeline's constructor
  this.timeline = new TimelineLite({ id: 'myTimeline' });

  // Or you can also define an id on the add function itself
  add(this.timeline, 'myTimeline');

  // Or it will generate an id if you don't specify any
  add(this.timeline);
}

componentWillUnmount() {
  // Remove the Timeline just by passing the reference to it
  remove(this.timeline);

  // Remove the Timeline by passing his id, without the reference
  remove(null, 'myTimeline');
}

/*
 * With Tween
 */

componentDidMount() {
  // You can define an id within the vars object
  this.tween = TweenLite.to(this.el, 1, { x: 50, id: 'myTween' });

  // Or you can define an id on the add function itself
  add(this.tween, 'myTween');

  // Or it will generate an id if you don't specify any
  add(this.tween);
}

componentWillUnmount() {
  // Remove the Tween just by passing the reference to it
  remove(this.tween);

  // Remove the Tween by passing his id, without the reference
  remove(null, 'myTween');
}`}
          </Code>

          <Reference>
            <h2>Shortcuts</h2>

            <ul>
              <li><code>space</code> Play/pause</li>
              <li><code>R</code> Reset in/out markers</li>
              <li><code>H</code> Toggle UI</li>
              <li><code>←</code> Rewind</li>
              <li><code>L</code> Toggle loop</li>
              <li><code>↑</code> Speed up</li>
              <li><code>E</code> Expand Timeline</li>
              <li><code>↓</code> Slow down</li>
            </ul>

            <h2>Reference</h2>

            <h3><code>&lt;GsapTools /&gt;</code> component</h3>

            <dl>
              <dt><b>isVisible</b> (default = false)</dt>
              <dd>Show GsapTools by default. Or not. It’s a free country.</dd>

              <dt><b>isFixed</b> (default = true)</dt>
              <dd>With the draggable feature, GsapTools defaults
              to <code>position: fixed</code> on top of everything. But you can
              pass <code>false</code> to this prop to position the tool however you like.
              </dd>

              <dt><b>onClick</b> (default = undefined)</dt>
              <dd>The tool comes with a built-in button to toggle the component. But if
              you decide to have your own button to handle this, just pass
              an <code>onClick</code> prop to the component and it will override the
              built-in function. This is useful if you have a whole dev tools
              package and already have a way to enable specific tools.
              </dd>
            </dl>

            <h3><code>add()</code> function</h3>

            <dl>
              <dt><b>Timeline/Tween</b> (required)</dt>
              <dd>The first argument to pass is the animation object. It can be either
              Tween or Timeline instances.
              </dd>

              <dt><b>id</b> (optional)</dt>
              <dd>Instead of passing the id to the timeline method constructor you can pass it on
              the <code>add()</code> function itself.
              </dd>
            </dl>

            <h3><code>remove()</code> function</h3>

            <p>This function is not required. It’s simpler to use the <code>disposer</code> function
            call via the reference to the <code>add()</code> function. However, you can still use
            it if you want.
            </p>

            <dl>
              <dt><b>Timeline/Tween</b> (required)</dt>
              <dd>The first argument to pass is the animation object. It can be either Tween
              or Timeline instances.
              </dd>

              <dt><b>id</b> (optional)</dt>
              <dd>The id of the animation if you defined one through the `add() function.
              In this case you have to pass the animation object argument as null.
              </dd>
            </dl>
          </Reference>
        </Content>

        <Content
          title="But, why?"
          subheading="Your friends at Ueno explain"
        >
          <p>We <span role="img" aria-label="heart">❤️ </span> GSAP.
          We <span role="img" aria-label="heart">❤️ </span> it so much that we
          use GSAP for animations on almost all
          of <a target="_blank" rel="noopener noreferrer" href="http://ueno.co/work/">our projects</a>.
          </p>

          <p>But one thing we were struggling with for a long time was debugging big
          animations. Most of the time we reload, reload, reload, reload, reload,
          reload, reload, reload. You get where this is going.
          </p>

          <p>Recently GSAP introduced their dev tools. We tried them but found they didn’t really
          fit our needs: Setting the tools up with webpack was a real mess; when unmounting a
          component, removing its animation after being registered is not possible; and finally,
          animations are only registered if they are played 2 seconds after the page is
          loaded, which is a problem if - for example - we have an animation playing based
          on user interaction, or when a waypoint is triggered.
          </p>

          <p>That’s why we decided to make our own tool to address these issues.</p>
        </Content>

        <Content
          title="You to the rescue"
          subheading="Lend a helping hand?"
        >
          <p>If you noticed any issues, have any ideas, or want to open pull requests, go check out
          the <a href="https://github.com/ueno-llc/gsap-tools" target="_blank" rel="noopener noreferrer">github repository</a>.
          And if you want to know more about who we are and what we
          do, <a href="http://ueno.co" target="_blank" rel="noopener noreferrer">here’s a link for that</a>.
          </p>
        </Content>
      </AppLayout>
    );
  }
}
