import EventEmitter from 'events';
import get from 'lodash/get';

class Store extends EventEmitter {

  timelines = new Map();

  get keys() {
    return this.timelines.keys();
  }

  get values() {
    return this.timelines.values();
  }

  get test() {
    console.log(this.timelines.get('Heading'));
    return this.timelines.get('Heading');
  }

  active(id) {
    // If no id specified and that we have timeline saved
    // let's return the first one we have
    if (!id && this.timelines.size > 0) {
      return this.values[0];
    }

    if (this.timelines.has(id)) {
      return this.timelines.get(id);
    }

    return [];
  }

  add(timeline, id) {
    const tId = id || get(timeline, 'vars.id');

    if (!tId) {
      return console.warn('You need to defined an id to the timeline');
    }

    if (!this.timelines.has(tId)) {
      console.log('Added');

      this.timelines.set(tId, timeline);
    }

    this.emit('change');

    return () => this.remove(timeline);
  }

  remove(timeline, id) {
    const tId = id || get(timeline, 'vars.id');

    if (this.timelines.has(tId)) {
      this.timelines.delete(tId);
    }

    this.emit('change');
  }
}

export default new Store();
