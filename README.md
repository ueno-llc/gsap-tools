# GsapTools

A simple way to debug GSAP's timelines

## Install
```bash
npm install --save-dev gsap-tools
```

## Features

- Play/pause
- Loop
- Rewind
- In/out markers
- Time scale
- Draggable UI
- Timelines added and removed when navigating between pages
- Works for `TimelineLite` or `TimelineMax`

## React's usage

**1. Add GsapTools component globally to your app**

**:rotating_light: Just import it once in your app.**

```js
import GsapTools from 'gsap-tools';

<GsapTools />
```

**2. Register your Gsap timeline to be control with GsapTools**

The simple way to do it:

- You defined an id on the `TimelineLite` constructor
- You create a reference to the add function to dispose of the timeline on the `componentWillUnmount`

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

Others ways:

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
