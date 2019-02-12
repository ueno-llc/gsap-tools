[![logo](https://user-images.githubusercontent.com/937328/50185016-8ce8c000-030e-11e9-942b-bdaf2df571f0.png)](https://ueno.co/?utm_source=github&utm_campaign=gsap-tools)
<br /><br />
![banner](https://user-images.githubusercontent.com/937328/50185018-8ce8c000-030e-11e9-9968-263f3b98cde2.png)
<br /><br />
[![about](https://user-images.githubusercontent.com/937328/51540139-999c8e80-1e4d-11e9-866d-284657a34744.png)](https://ueno.co/contact/?utm_source=github&utm_campaign=gsap-tools)
<br /><br />

## GsapTools

[![npm version](https://badge.fury.io/js/gsap-tools.svg)](https://badge.fury.io/js/gsap-tools)

**A simple tool to debug GSAP animations**

Managing and debugging Tween and Timeline in GSAP is a hassle, even with the official dev tools. So we created GsapTools, a tool for React<sup>1</sup>, that makes it all so much easier. Scroll down to know more and go take a look at the <a href="https://ueno-llc.github.io/gsap-tools">website</a>.

—

**1. GsapTools only works with React for the moment, but we plan to make it works on other popular front-end library in the future.**

## Installation
```bash
yarn add gsap-tools
```

## Features

- Play/pause
- Loop
- Rewind
- In/out markers
- Timescale
- Draggable UI
- Updated animations
- Timeline details

## How to use it

**First, add GsapTools component globally to your application.** You only need to do this once.

```js
import GsapTools from 'gsap-tools';

<GsapTools />
```

**Next, register your GSAP animation to be controlled with GsapTools.**

Define an id on the Timeline constructor or on the Tween vars object, call the add function to register the timeline, and create a reference to the add function to remove it when the component is unmounted.

```js
import { add } from 'gsap-tools';

componentDidMount() {
  this.t = new TimelineLite({ id: 'myTimeline' });

  this.disposer = add(this.t);
}

componentWillUnmount() {
  this.disposer();
}
```

That’s the simpler version. Here is an alternative setup.

```js
import { add } from 'gsap-tools';

/*
 * With Timeline
 */

componentDidMount() {
  // You can define an id on the Timeline's constructor
  this.timeline = new TimelineLite({ id: 'myTimeline' });

  // Or you can also define an id on the add function itself
  this.disposer = add(this.timeline, 'myTimeline');

  // Or it will generate an id if you don't specify any
  this.disposer = add(this.timeline);
}

componentWillUnmount() {
  // Remove the Timeline by using the disposer reference
  this.disposer();
}

/*
 * With Tween
 */

componentDidMount() {
  // You can define an id within the vars object
  this.tween = TweenLite.to(this.el, 1, { x: 50, id: 'myTween' });

  // Or you can define an id on the add function itself
  this.disposer = add(this.tween, 'myTween');

  // Or it will generate an id if you don't specify any
  this.disposer = add(this.tween);
}

componentWillUnmount() {
  // Remove the Tween by using the disposer reference
  this.disposer();
}
```

## Examples

- The GsapTools’ website use the tool itself, you can see it in action here: <a href="https://github.com/ueno-llc/gsap-tools/blob/react-gh-pages/src/components/app-layout/AppLayout.js#L23">AppLayout.js</a> and <a href="https://github.com/ueno-llc/gsap-tools/blob/react-gh-pages/src/components/hero/Hero.js#L48">Hero.js</a>.
- There is also more examples with Tween and Timeline also <a href="https://github.com/JeremDsgn/gsap-test/tree/master/src/components">here</a>.

## Shortcuts

- <kbd>space</kbd> Play/pause
- <kbd>L</kbd> Toggle loop
- <kbd>H</kbd> Toggle UI
- <kbd>E</kbd> Expand Timeline
- <kbd>R</kbd> Reset in/out markers
- <kbd>←</kbd> Rewind
- <kbd>↑</kbd> Speed up
- <kbd>↓</kbd> Slow down

## References

### `<GsapTools />` component

- **isVisible** (default = false) Show GsapTools by default. Or not. It’s a free country.

- **isFixed** (default = true) With the draggable feature, GsapTools defaults to `position: fixed`
on top of everything. But you can pass `false` to this prop to position the tool however you like.

- **onClick** (default = undefined) The tool comes with a built-in button to toggle the component.
But if you decide to have your own button to handle this, just pass an `onClick` prop to the component
and it will override the built-in function. This is useful if you have a whole dev tools package
and already have a way to enable specific tools.

### `add()` function

- **Timeline/Tween** (required) The first argument to pass is the animation object. It can be either Tween or Timeline instances.

- **id** (optional) Instead of passing the id to the timeline method constructor you can pass it on the `add()` function itself.

## But, why?

We ❤️ GSAP. We ❤️ it so much that we use GSAP for animations on almost all of <a href="http://ueno.co/work/">our projects</a>.

But one thing were struggling with for a long time was debugging big timelines. Most of the time we reload,
reload, reload, reload, reload, reload, reload, reload. You get where this is going.

Recently GSAP introduced their dev tools. We tried them but found they didn’t really fit our needs: Setting
the tools up with webpack, a real mess; when unmounting a component, removing its timeline after being
registered is not possible; and finally, animations are only registered if they are played 2 seconds after
the page is loaded, which is a problem if we have an animation playing based on user interaction, or
when a waypoint is triggered.

That’s why we decided to make our own tool to address these issues.

## You to the rescue

If you noticed any issues, have any ideas, or want to open pull requests, just do it.
And if you want to know more about who we are and what we do, <a href="http://ueno.co/">here’s a link for that</a>.

## Development

In source folder:

```bash
npm run watch
npm link
```

In project:

```bash
npm link gsap-tools
```
