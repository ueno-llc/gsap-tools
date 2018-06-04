import EventEmitter from 'events';
import { TweenLite } from 'gsap';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

class Store extends EventEmitter {

  timelines = new Map();

  // Return timelines IDs
  get keys() {
    return Array.from(this.timelines.keys());
  }

  // Return timelines gsap objects
  get values() {
    return Array.from(this.timelines.values());
  }

  active(id) {
    // If no id is specified and we have at least
    // one timeline saved, we return the first one
    if (!id && this.timelines.size > 0) {
      return this.values[0];
    }

    // Check if the specified timeline exists and return it
    if (this.timelines.has(id)) {
      return this.timelines.get(id);
    }

    // Return an empty array if we don't have anything
    return [];
  }

  add(timeline, timelineId) {
    // If an id is specified on the `add` function, or
    // in the timeline constructor itself
    let id = timelineId || get(timeline, 'vars.id');

    // Otherwise, let's generated an id based on the index of
    // the actual timelines stored
    if (!id) {
      id = `Timeline ${this.timelines.size + 1}`;
    }

    // We store in the data object, if the animation
    // is a timeline or just a tween
    timeline.data = { isTween: timeline instanceof TweenLite };

    // As soon as we have the id, we check it doesn't already
    // exists and then we set the timeline in the map
    if (!this.timelines.has(id)) {
      this.timelines.set(id, timeline);
    }

    // Event emitted to re-render on the tool
    this.emit('change');

    // Retun a function to remove a timeline from the map
    // without specifying any id
    return () => this.remove(timeline);
  }

  remove(timeline, timelineId) {
    // Check if we have an id specified
    const id = timelineId || get(timeline, 'vars.id');

    if (id) {
      // Remove the timeline with the specified id
      this.timelines.delete(id);
    } else {
      // Otherwise, loop through the `Map()` and
      // use the key to remove it
      this.timelines.forEach((v, k) => {
        if (isEqual(v, timeline)) {
          this.timelines.delete(k);
        }
      });
    }

    // Event emitted to re-render on the tool
    this.emit('change');
  }
}

export default new Store();
