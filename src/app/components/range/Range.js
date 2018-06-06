import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash/clamp';
import { TweenLite } from 'gsap';

import storage from 'utils/storage';
import { SIZES } from 'utils/constants';

import s from './Range.scss';

export default class Range extends PureComponent {

  static propTypes = {
    value: PropTypes.number,
    isActive: PropTypes.bool,
    isExpanded: PropTypes.bool,
    isTablet: PropTypes.bool,
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragMarkerIn: PropTypes.func,
    onDragMarkerOut: PropTypes.func,
    onDragMarkerReset: PropTypes.func,
  }

  static defaultProps = {
    value: 0,
  }

  markerIn = 0
  markerOut = 0
  widthWithoutHandle = 0
  isExpanding = false

  componentDidMount() {
    this.initRange();
  }

  componentWillReceiveProps(props) {
    this.isExpanding = false;

    // Let's calculate the size of the range if we change screen size
    if (props.isTablet && props.isTablet !== this.props.isTablet) {
      this.initRange();
    }

    // We init markers if we had any on localstorage
    if (props.isActive && props.isActive !== this.props.isActive) {
      // Need the timeout to get the `this.range` component available
      setTimeout(this.initMarkers);
    }

    if (props.isExpanded !== this.props.isExpanded) {
      this.isExpanding = true;

      // The timeout is equal to the css transition to expand the box
      setTimeout(() => {
        this.initRange();
        this.initMarkers();
        this.handleProgress(props);
        this.isExpanding = false;
      }, 240);
    }

    // If the value of the range changes, let's update the
    // position of the handle and the progress bar
    if (props.value !== this.props.value) {
      this.handleProgress(props);
    }
  }

  /**
   * Internal functions
   */

  get calculateFillWidth() {
    // Return the width of the progress bar
    return (this.markerOut + SIZES.MARKER_WIDTH) - this.markerIn;
  }

  initRange = () => {
    if (!this.range) {
      return;
    }

    const { offsetWidth: rw } = this.range;

    this.widthWithoutHandle = rw - SIZES.HANDLE_WIDTH;
    this.markerOut = rw - SIZES.MARKER_WIDTH;
  }

  initMarkers = () => {
    // If we only set a outPercent value, inPercent needs to be superior
    // to 0, to avoid dividing by 0
    const inPercent = Number(storage.get('IN_PERCENT')) || 0.01;
    const outPercent = Number(storage.get('OUT_PERCENT')) || 100;

    // There is nothing to init if markers are
    // to theirs initials values
    if (
      (inPercent <= 0 && outPercent === 100) ||
      !this.rangeIn || !this.rangeOut
    ) {
      return;
    }

    const { offsetWidth: rw } = this.range;
    const w = rw - SIZES.MARKER_WIDTH;
    const val = (inPercent * w) / 100;

    // We set the markerIn and markerOut values
    this.markerIn = inPercent ? val : w;
    this.markerOut = outPercent ? (outPercent * w) / 100 : w;

    const left = this.markerIn;
    const right = (rw - SIZES.MARKER_WIDTH) - this.markerOut;
    const width = this.markerIn > 0 ? val - this.markerIn : val;

    TweenLite.set(
      this.fill,
      {
        left,
        width,
      },
    );

    TweenLite.set(
      this.handle,
      { left: val > SIZES.MARKER_WIDTH ? val : SIZES.MARKER_WIDTH },
    );

    TweenLite.set(
      this.rangeIn,
      { left },
    );

    TweenLite.set(
      this.rangeOut,
      { right },
    );
  }

  handleProgress = ({ onDrag, value }) => {
    if (!onDrag || !this.fill || !this.handle) {
      return;
    }

    const { offsetWidth: rw } = this.range;
    const val = (value * (rw - SIZES.MARKER_MEDIAN_WIDTH)) / 100;

    if (val < this.markerIn || val > (this.markerOut + 7.5)) {
      return;
    }

    const width = this.markerIn > 0 ? val - this.markerIn : val;
    const left = val > SIZES.MARKER_MEDIAN_WIDTH ? val : SIZES.MARKER_MEDIAN_WIDTH;

    TweenLite.set(
      this.fill,
      { width },
    );

    TweenLite.set(
      this.handle,
      { left },
    );
  }

  /*
   * Functions to manage the range component
   */

  getValueFromPosition = (pos) => {
    const val = clamp(pos, 0, this.widthWithoutHandle);

    return (val / (this.widthWithoutHandle || 1)) * 100;
  }

  position = (e) => {
    const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
    const { left } = this.range.getBoundingClientRect();

    return coordinate - left - SIZES.HANDLE_MEDIAN_WIDTH;
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

    if (!onDrag) {
      return;
    }

    const { currentTarget } = e;
    const pos = this.position(e);
    const value = this.getValueFromPosition(pos);

    if (pos <= this.markerIn || pos >= this.markerOut) {
      return;
    }

    onDrag(value);

    // If we start dragging on the range component, we add a listenner
    // on the dragging event itself as well
    if (currentTarget.id === 'range') {
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleEnd);
      document.addEventListener('touchMove', this.handleDrag);
      document.addEventListener('touchEnd', this.handleEnd);

      if (onDragStart) {
        onDragStart();
      }
    }
  }

  handleEnd = () => {
    const { onDragEnd } = this.props;

    // We remove all listeners as soon as we stop dragging
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mousemove', this.handleMarkerInDrag);
    document.removeEventListener('mousemove', this.handleMarkerDragOut);
    document.removeEventListener('mouseup', this.handleEnd);
    document.removeEventListener('touchMove', this.handleDrag);
    document.removeEventListener('touchEnd', this.handleEnd);

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
    const left = (value * (rw - SIZES.MARKER_WIDTH)) / 100;

    this.markerIn = left;

    if (left < (this.markerOut - SIZES.MARKER_WIDTH)) {
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
    const val = (value * (rw - SIZES.MARKER_WIDTH)) / 100;
    const right = (rw - SIZES.MARKER_WIDTH) - val;

    this.markerOut = val;

    if (val >= (this.markerIn + SIZES.MARKER_WIDTH)) {
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

  clear = () => {
    this.handleMarkersDoubleClick();
  }

  handleMarkersDoubleClick = () => {
    const { onDragMarkerReset } = this.props;

    if (!this.rangeIn || !this.rangeOut || !this.fill) {
      return;
    }

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
    const { isActive, isExpanded, isTablet, onDragMarkerIn, onDragMarkerOut } = this.props;
    const { isExpanding } = this;

    return (
      <div className={s(s.range, { isActive, isExpanded, isExpanding, isTablet })}>
        <div className={s.range__container}>
          {(isActive && onDragMarkerIn && !isTablet) && (
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

          {(isActive && onDragMarkerOut && !isTablet) && (
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

          {isActive && (
            <button
              ref={(c) => { this.handle = c; }}
              className={s.range__handle}
              onMouseDown={this.handleStart}
              onTouchMove={this.handleDrag}
              onTouchEnd={this.handleEnd}
            />
          )}

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
      </div>
    );
  }
}
