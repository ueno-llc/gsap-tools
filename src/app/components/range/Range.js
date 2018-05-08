import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import clamp from 'lodash/clamp';

import s from './Range.scss';

export default class Range extends PureComponent {

  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    onChangeStart: PropTypes.func,
    onChangeComplete: PropTypes.func,
  }

  static defaultProps = {
    value: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      limit: 0,
      grab: 0,
    };
  }

  componentDidMount() {
    this.handleUpdate();

    const resizeObserver = new ResizeObserver(this.handleUpdate);

    resizeObserver.observe(this.range);
  }

  handleUpdate = () => {
    if (!this.range || !this.handle) {
      return;
    }

    const sliderPos = this.range.offsetWidth;
    const handlePos = this.handle.offsetWidth;

    this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2,
    });
  }

  handleStart = (e) => {
    const { onChangeStart } = this.props;

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);

    if (onChangeStart) {
      onChangeStart(e);
    }
  }

  handleDrag = (e) => {
    e.stopPropagation();

    const { onChange, onChangeStart } = this.props;
    const { currentTarget } = e;

    if (!onChange) {
      return;
    }

    const value = this.position(e);

    onChange(value, e);

    if (currentTarget.id === 'range') {
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleEnd);

      if (onChangeStart) {
        onChangeStart();
      }
    }
  }

  handleEnd = () => {
    const { onChangeComplete } = this.props;

    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleEnd);

    if (onChangeComplete) {
      onChangeComplete();
    }
  }

  getPositionFromValue = (value) => {
    const { limit } = this.state;
    const percentage = value / 100;

    return Math.round(percentage * limit);
  }

  getValueFromPosition = (pos) => {
    const { limit } = this.state;
    const percentage = clamp(pos, 0, limit) / (limit || 1);

    return Math.round(percentage * 100);
  }

  position = (e) => {
    const { grab } = this.state;
    const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
    // const { left } = this.range.getBoundingClientRect();
    // const pos = coordinate - left - grab;

    // return this.getValueFromPosition(pos);
  }

  coordinates = (pos) => {
    const { grab } = this.state;
    const value = this.getValueFromPosition(pos);
    const position = this.getPositionFromValue(value);

    return position + grab;
  }

  render() {
    const { value } = this.props;

    const position = this.getPositionFromValue(value);
    const coords = this.coordinates(position);
    const fillStyle = { width: `${coords}px` };
    const handleStyle = { left: `${coords}px` };

    return (
      <div // eslint-disable-line
        ref={(c) => { this.range = c; }}
        className={s.range}
        onMouseDown={this.handleDrag}
        onMouseUp={this.handleEnd}
        onTouchStart={this.handleStart}
        onTouchEnd={this.handleEnd}
        id="range"
      >
        <div className={s.range__fill} style={fillStyle} />

        <button
          ref={(c) => { this.rangeIn = c; }}
          className={s(s.range__markers, s.range__markersIn)}
        >
          <svg width="10.1" height="17.9" viewBox="0 0 10.1 17.9">
            <path fille="#cad5db" d="M10.1,13.3L10.1,13.3l-4.2,4.4c-0.4,0.4-1,0.4-1.4,0L0,13.3l0.1-0.1V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1L10.1,13.3L10.1,13.3z" />
          </svg>
        </button>

        <button
          ref={(c) => { this.rangeOut = c; }}
          className={s(s.range__markers, s.range__markersOut)}
        >
          <svg width="10.1" height="17.9" viewBox="0 0 10.1 17.9">
            <path fille="#cad5db" d="M10.1,13.3L10.1,13.3l-4.2,4.4c-0.4,0.4-1,0.4-1.4,0L0,13.3l0.1-0.1V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1L10.1,13.3L10.1,13.3z" />
          </svg>
        </button>

        <button
          ref={(c) => { this.handle = c; }}
          className={s.range__handle}
          onMouseDown={this.handleStart}
          onTouchMove={this.handleDrag}
          onTouchEnd={this.handleEnd}
          style={handleStyle}
        />
      </div>
    );
  }
}