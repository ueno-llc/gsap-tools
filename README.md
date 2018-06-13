# GsapTools, by Ueno

**A simple tool to debug GSAP animations**

Managing and debugging Tween and Timeline in GSAP is a hassle, even with the official dev tools. So we created GsapTools, an extension that makes it all so much easier. Scroll down to know more and go take a look at the <a href="https://ueno-llc.github.io/gsap-tools">website</a>.

![github](https://user-images.githubusercontent.com/937328/41342560-114d03f4-6eec-11e8-96df-f5a9ace6a725.png)

## Installation
```bash
npm install gsap-tools
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
import { add, remove } from 'gsap-tools';

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
}
```

## Shortcuts

- `space`: Play/pause
- `L`: Toggle loop
- `H`: Toggle UI
- `E`: Expand Timeline
- `R`: Reset in/out markers
- `←`: Rewind
- `↑`: Speed up
- `↓`: Slow down

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

- **Timeline/Tween** (required): The first argument to pass is the animation object. It can be either Tween or Timeline instances.

- **id** (optional) Instead of passing the id to the timeline method constructor you can pass it on the `add()` function itself.

### `remove()` function

This function is not required. It’s simpler to use the disposer function call via the reference to the `add()` function. However, you can still use it if you want.

- **Timeline/Tween** (optional) The first argument to pass is the animation object. It can be either Tween or Timeline instances.

- **id** (optional) The id of the animation if you defined one through the `add()` function. In this case you have to pass the animation object argument as null.

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
