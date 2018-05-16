import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash/clamp';
import { TweenLite } from 'utils/gsap';

import s from './Range.scss';

const HANDLE_WIDTH = 20;
const HANDLE_MEDIAN_WIDTH = HANDLE_WIDTH / 2;
const MARKER_WIDTH = 10;
const MARKER_MEDIAN_WIDTH = MARKER_WIDTH / 2;

export default class Range extends PureComponent {

  static propTypes = {
    value: PropTypes.number,
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragMarkerIn: PropTypes.func,
    onDragMarkerOut: PropTypes.func,
    onDragMarkerReset: PropTypes.func,
    hasTimeline: PropTypes.bool,
  }

  static defaultProps = {
    value: 0,
  }

  markerIn = 0
  markerOut = 0
  widthWithoutHandle = 0

  componentDidMount() {
    setTimeout(() => {
      this.initRange();
      this.markerOut = this.range.offsetWidth - MARKER_WIDTH;
    });
  }

  componentWillReceiveProps(props) {
    // If the value of the range has changd, let's update the position
    // of the handle and the progress bar
    if (props.value !== this.props.value) {
      this.handleProgress(props);
    }
  }

  /**
   * Internal functions
   */

  get calculateFillWidth() {
    // Return the width of the progress bar
    return (this.markerOut + MARKER_WIDTH) - this.markerIn;
  }

  initRange = () => {
    if (!this.range) {
      return;
    }

    this.widthWithoutHandle = this.range.offsetWidth - HANDLE_WIDTH;
  }

  handleProgress = ({ onDrag, value }) => {
    if (!onDrag || !this.fill || !this.handle) {
      return;
    }

    const { offsetWidth: rw } = this.range;
    const val = (value * (rw - MARKER_MEDIAN_WIDTH)) / 100;

    if (val < this.markerIn || val > (this.markerOut + 7.5)) {
      return;
    }

    const width = this.markerIn > 0 ? val - this.markerIn : val;

    TweenLite.set(
      this.fill,
      { width },
    );

    TweenLite.set(
      this.handle,
      { left: val > MARKER_MEDIAN_WIDTH ? val : MARKER_MEDIAN_WIDTH },
    );
  }

  /*
   * Functions to manage the range component
   */

  getValueFromPosition = (pos) => {
    const value = clamp(pos, 0, this.widthWithoutHandle) / (this.widthWithoutHandle || 1);

    return Math.round(value * 100);
  }

  position = (e) => {
    const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
    const { left } = this.range.getBoundingClientRect();

    return coordinate - left - HANDLE_MEDIAN_WIDTH;
  }

  handleStart = (e) => {
    const { onDragStart } = this.props;

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);

    if (onDragStart) {
      onDragStart(e);
    }
  }

  handleDrag = (e) => {
    const { onDrag, onDragStart } = this.props;
    const { currentTarget } = e;

    if (!onDrag) {
      return;
    }

    const pos = this.position(e);
    const value = this.getValueFromPosition(pos);

    if (pos <= this.markerIn || pos >= this.markerOut) {
      return;
    }

    onDrag(value);

    if (currentTarget.id === 'range') {
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleEnd);

      if (onDragStart) {
        onDragStart();
      }
    }
  }

  handleEnd = () => {
    const { onDragEnd } = this.props;

    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mousemove', this.handleMarkerInDrag);
    document.removeEventListener('mousemove', this.handleMarkerDragOut);
    document.removeEventListener('mouseup', this.handleEnd);

    if (onDragEnd) {
      onDragEnd();
    }
  }

  handleMarkerInDragStart = () => {
    this.fillWidth = this.fill.offsetWidth;

    document.addEventListener('mousemove', this.handleMarkerInDrag);
    document.addEventListener('mouseup', this.handleEnd);
  }

  handleMarkerInDrag = (e) => {
    const { onDrag, onDragMarkerIn } = this.props;

    if (!onDrag || !this.rangeIn || !this.fill) {
      return;
    }

    const value = this.getValueFromPosition(this.position(e));
    const { offsetWidth: rw } = this.range;
    const left = (value * (rw - MARKER_WIDTH)) / 100;

    this.markerIn = left;

    if (left < (this.markerOut - MARKER_WIDTH)) {
      onDrag(value + 0.5); // Align handle with marker
      onDragMarkerIn(value);

      TweenLite.set(
        this.rangeIn,
        { left },
      );

      TweenLite.set(
        this.fill,
        {
          left,
          width: 0,
        },
      );
    }
  }

  handleMarkerOutDragStart = () => {
    this.fillWidth = this.fill.offsetWidth;

    document.addEventListener('mousemove', this.handleMarkerDragOut);
    document.addEventListener('mouseup', this.handleEnd);
  }

  handleMarkerDragOut = (e) => {
    const { onDrag, onDragMarkerOut } = this.props;

    if (!onDrag || !this.rangeOut || !this.fill) {
      return;
    }

    const value = this.getValueFromPosition(this.position(e));
    const { offsetWidth: rw } = this.range;
    const val = (value * (rw - MARKER_WIDTH)) / 100;
    const right = (rw - MARKER_WIDTH) - val;

    this.markerOut = val;

    if (val >= (this.markerIn + MARKER_WIDTH)) {
      onDrag(value + 0.5); // Align handle with marker
      onDragMarkerOut(value);

      TweenLite.set(
        this.rangeOut,
        { right },
      );

      TweenLite.set(
        this.fill,
        { width: this.calculateFillWidth },
      );
    }
  }

  handleMarkersDoubleClick = () => {
    const { onDragMarkerReset } = this.props;

    this.markerIn = 0;
    this.markerOut = this.range.offsetWidth;

    if (onDragMarkerReset) {
      onDragMarkerReset();
    }

    TweenLite.set(
      this.rangeIn,
      { left: 0 },
    );

    TweenLite.set(
      this.rangeOut,
      { right: 0 },
    );

    TweenLite.set(
      this.fill,
      {
        left: 0,
        width: 0,
      },
    );
  }

  render() {
    const { onDragMarkerIn, onDragMarkerOut, hasTimeline } = this.props;

    return (
      <div className={s.range}>
        {(hasTimeline && onDragMarkerIn) && (
          <button
            ref={(c) => { this.rangeIn = c; }}
            className={s(s.range__markers, s.range__markersIn)}
            onMouseDown={this.handleMarkerInDragStart}
            onDoubleClick={this.handleMarkersDoubleClick}
          >
            <svg width="10" height="18" viewBox="0 0 10 18">
              <path fille="#cad5db" d="M5.8,17.7c-0.4,0.4-0.9,0.4-1.3,0L0,13.3V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1v12.3L5.8,17.7z" />
            </svg>
          </button>
        )}

        {(hasTimeline && onDragMarkerOut) && (
          <button
            ref={(c) => { this.rangeOut = c; }}
            className={s(s.range__markers, s.range__markersOut)}
            onMouseDown={this.handleMarkerOutDragStart}
            onDoubleClick={this.handleMarkersDoubleClick}
          >
            <svg width="10" height="18" viewBox="0 0 10 18">
              <path fille="#cad5db" d="M5.8,17.7c-0.4,0.4-0.9,0.4-1.3,0L0,13.3V1c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1v12.3L5.8,17.7z" />
            </svg>
          </button>
        )}

        <button
          ref={(c) => { this.handle = c; }}
          className={s.range__handle}
          onMouseDown={this.handleStart}
          onTouchMove={this.handleDrag}
          onTouchEnd={this.handleEnd}
        />

        <div // eslint-disable-line
          ref={(c) => { this.range = c; }}
          className={s.range__input}
          onMouseDown={this.handleDrag}
          onMouseUp={this.handleEnd}
          onTouchStart={this.handleStart}
          onTouchEnd={this.handleEnd}
          id="range"
        >
          <div
            ref={(c) => { this.fill = c; }}
            className={s.range__fill}
          />
        </div>
      </div>
    );
  }
}
