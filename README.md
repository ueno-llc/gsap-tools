# GsapTools, by Ueno

**A simple tool to debug GSAP animations**

Managing and debugging tweens and timelines in GSAP is a hassle, even with their new dev tools. So we created GsapTools, an extension that makes it all so much easier.

## Installation
```bash
npm install --save-dev gsap-tools
```

## Features

- Play/pause
- Loop
- Rewind
- In/out markers
- Timescale
- Draggable UI
- Updated timelines
- Timelines details

## How to use it

**First, add GsapTools component globally to your application.** You only need to do this once.

```js
import GsapTools from 'gsap-tools';

<GsapTools />
```

**Next, register your Gsap timeline to be controlled with GsapTools.**

Define an id on the timeline method constructor, call the add function to register the timeline,
and create a reference to the add function to remove it when the component is unmounted.

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

componentDidMount() {
  this.t = new TimelineLite();

  // You can defined the id of the timeline on the `add` function itself
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
}
```

## Shortcuts

- `space`: Play/pause
- `L`: Toggle loop
- `H`: Toggle UI
- `←`: Rewind
- `↑`: Speed up
- `↓`: Slow down

## References

### `<GsapTools />` component

- **isVisible** (default = false): Show GsapTools by default. Or not. It’s a free country.

- **isFixed** (default = true): With the draggable feature, GsapTools defaults to `position: fixed`
on top of everything. But you can pass false to this prop to position the tool however you like.

- **onClick** (default = undefined): The tool comes with a built-in button to toggle the component.
But if you decide to have your own button to handle this, just pass an `onClick prop to the component
and it will override the built-in function. This is useful if you have a whole dev tools package
and already have a way to enable specific tools.

### `add()` function

- **Timeline/Tween** (required): The first argument to pass is the timeline from your animation.
You can either pass Tween or Timeline instances.

- **id** (optional): Instead of passing the id to the timeline method constructor you can
pass it on the `add()` function itself. `add(this.timeline, ‘myId’);`

### `remove()` function

This function is not required. It’s simpler to use the `disposer function call
via the reference to the `add()` function. However, you can still use it if you want.

- **Timeline/Tween** (optional): The first argument to pass is the timeline from your animation.
For the moment this only works with TimelineLite and TimelineMax.

- **id** (optional): Instead of passing the id to the timeline method constructor you can pass
it on the `add()` function itself. `add(this.timeline, ‘myId’);

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
And if you want to know more about who we are and what we do, <a href="http://ueno.co/">there’s a link for that</a>.

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
