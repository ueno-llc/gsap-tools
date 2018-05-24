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

## React's usage

**1. Add GsapTools component globally to your app**

**:rotating_light: Just import it once in your app.**

```js
import GsapTools from 'gsap-tools';

<GsapTools />
```

**2. Register your Gsap timeline to be control with GsapTools**

The simple way to do it:

- You defined an id on the `TimelineLite()` constructor
- You create a reference to the add function to dispose of the timeline on the `componentWillMount()`

```js
import { add } from 'gsap-tools';

componentDidMount() {
  this.t = new TimelineLite({ id: 'myTimeline' });

  this.disposer = add(this.t);
}

componentWillMount() {
  this.disposer();
}
```

Others ways:

```js
componentDidMount() {
  this.t = new TimelineLite();

  add(this.t, 'myTimeline'); // You can defined the id of the timeline on the `add()` function itself

  // or

  add(this.t); // It will generated an id, if you don't specified any
}

componentWillMount() {
  remove(this.t); // Remove the timeline just by passing the reference to the timeline

  // or

  remove(null, 'myTimeline') // Remove the timeline by passing the id, without the timeline reference
}
```

## Development

In source folder:

```bash
npm run watch
```

In another tab from source folder:

```bash
npm link
```

In project:
```bash
npm link gsap-tools
```
