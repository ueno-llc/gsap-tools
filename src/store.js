import EventEmitter from 'events';

class Store extends EventEmitter {

  timelines = new Set()

  add(timeline) {
    this.timelines.add(timeline);

    console.log('Added timeline', this.timelines);

    this.emit('change');
  }

  remove(timeline) {
    const r = this.timelines.delete(timeline);

    console.log('Removed timeline', r, this.timelines);

    this.emit('change');
  }
}


export default new Store();