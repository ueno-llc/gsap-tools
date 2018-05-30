# GsapTools

**A simple way to debug GSAP's timelines**

GsapTools is a simple interface to control all your timeline. Time saver to debug
and be sure to make animations as precise as the one designers sent to you or as you want.

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
- TimelineLite and TimelineMax ready

## How to use it

**Add GsapTools component globally to your application**

You only need to add it once

```js
import GsapTools from 'gsap-tools';

<GsapTools />
```

**Register your GSAP timeline to be manage by GsapTools**

The simplest way to do it, is to define an id on the Timeline method constructor,
call the add function to register the timeline and create a reference to the add
function to remove it when the component is unmounted.

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

Alternatively, there is other ways to do it:

```js
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
- `↑`: Speed up timescale
- `↓`: Slow down timescale

## References

### `<GsapTools />` component

- **isVisible** (default = false): You can choose to show the GsapTools by default.

- **isFixed** (default = true): With the draggable feature, the GsapTools is on fixed position to be on top of everything.
But you can decide to position it in another way by passing false to this props.

- **onClick** (default = undefined): The tool comes with a build-in button to toggle the component. But if you decide to have
your own button to handle this, just pass an onClick props to the component and it will
remove the build-in one. It’s usefull if you have a whole dev tools package and
already have a way to enable one or another tool.

### `add()` function

- **timeline** (required): The first argument to pass is the timeline from your animation. It only works with
`TimelineLite` and `TimelineMax` for the moment.

- **id** (optional): Instead of passing the id to the timeline method constructor you can pass it on
the `add()` function itself `add(this.timeline, ‘myId’)`.

### `remove()` function

This function is not required. It’s simpler through the disposer function call
via the reference to the `add()` function. However you can still use it if you want.

- **timeline** (optional): The previous timeline you added. It can be the reference to it.
`this.t = new TimelineLite()` then `remove(this.t)`.

- **id** (optional): The id of the timeline if you defined one through the add function. In this case
you have to pass the timeline argument as null `remove(null, ‘myId’)`.

## Motivation

We love the work of the GSAP’s guys. We love it so much that we are using GSAP
on almost every of our projects when it comes to animations.

One thing that were are struggling for a long time has been debugging big timelines.
Most of the time, we reload, reload, reload, reload, reload, reload, reload, reload.
Yupp, and it’s not even accurate to the number of reload we need to do to, to
finish an animation from A to Z.

GSAP introduced a dev tools recently, and we tried it. But it wasn’t fitting our needs.
It wasn’t possible to remove a timeline after being registered when we unmounted a
component. Animations are only register if they are played 2 seconds after the
pages is loaded, which is a problem when we have a lot of animation playing on
users actions or some waypoint triggered.

That’s why we decide to start our own tool to addresses all this issues.

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
