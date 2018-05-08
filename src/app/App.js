import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Range from 'components/range';
import store from 'store';

export default class App extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  };

  componentDidMount() {
    store.on('change', this.onStoreChange);
  }

  componentWillUnmount() {
    store.removeListener('change', this.onStoreChange);
  }

  onStoreChange = () => {
    console.log('change', store.timelines);

    // temp
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <p>Timelines in store: {store.timelines.size}</p>

        <Range
          value={10}
          // onChange={this.handleRange}
          // onChangeStart={this.handleRangeStart}
          // onChangeComplete={this.handleRangeComplete}
          // onChangeMarkerIn={this.handleInRange}
          // onChangeMarkerOut={this.handleOutRange}
        />
      </div>
    );
  }
}