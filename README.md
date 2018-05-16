# GsapTools

A simple way to debug GSAP's timelines

## Install
```bash
npm install --save-dev gsap-tools
```

## Usage

### React

**1. Add the GsapTools component**

Wherever you want you to include the GsapTools, just import it like this.
You can toggle and drag the ui box as you want on the screen.

```js
import GsapTools from 'gsap-tools';

...

<GsapTools />
```

**2. Register your Gsap timeline to be control with the GsapTools**

```js
import { add, remove } from 'gsap-tools';

...

componentDidMount() {
  this.t = new TimelineLite();

  ...

  add(this.t, 'myTimeline');
}

componentWillMount() {
  remove(this.t, 'myTimeline');
}
```

you can also use the id from the timeline constructor,

```js
import { add, remove } from 'gsap-tools';

...

componentDidMount() {
  this.t = new TimelineLite({ id: 'myTimeline' });

  ...

  add(this.t);
}

componentWillMount() {
  remove(this.t);
}
```

## Development

In source folder:
```bash
npm link
```

In project:
```bash
npm link gsap-tools
```
