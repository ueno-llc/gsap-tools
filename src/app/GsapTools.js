import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { TimelineMax } from 'gsap';

import isClient from 'utils/isClient';
import getMatrix from 'utils/getMatrix';
import storage from 'utils/storage';
import { SPEEDS } from 'utils/constants';
import clearProps from 'utils/clearProps';

import Header from 'components/header';
import Timeline from 'components/timeline';
import Controls from 'components/controls';
import Range from 'components/range';
import Button from 'components/button';

import store from 'store';

import s from './GsapTools.scss';

class GsapTools extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    isVisible: PropTypes.bool,
    isFixed: PropTypes.bool,
  }

  static defaultProps = {
    isFixed: true,
  }

  constructor(props) {
    super(props);

    this.inTime = 0;
    this.isDragging = false;
    this.isChanging = false;

    this.state = {
      value: 0,
      active: {},
      timeScale: 1,
      playIcon: true,
      position: { x: 0, y: 0 },
      isLoaded: false,
      isVisible: props.isVisible,
      isExpanded: false,
      isLoop: false,
      isTablet: false,
    };
  }

  componentWillMount() {
    // Add a store's listener for changes
    store.on('change', this.onStoreChange);

    // Get screen size
    this.onResize();

    // Init the master which will contain animations to debug
    this.initMaster();

    // Init controls from local storage values
    this.initUI();

    // Listen for keyboard shortcut
    document.addEventListener('keydown', this.onKeyDown);

    // Listen for document resize to enable mobile version
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(props) {
    if (props.isVisible !== this.props.isVisible) {
      this.setState({ isVisible: props.isVisible });
    }
  }

  componentWillUnmount() {
    // Remove the store's listener when unmouting the component
    store.removeListener('change', this.onStoreChange);

    // Remove shortcut listener
    document.removeEventListener('keydown', this.onKeyDown);

    // Remove resize listener
    window.removeEventListener('resize', this.onResize);
  }

  /*
   * Internal functions
   * They are mainly made to drag, toggle the ui
   * and init the saved preferences
   */

  onKeyDown = (e) => {
    const { timeScale } = this.state;
    const currentIndex = SPEEDS.indexOf(timeScale);

    if (e.keyCode === 32) { // Space bar
      e.preventDefault();

      this.handlePlayPause();
    } else if (e.keyCode === 76) { // L char
      this.handleLoop();
    } else if (e.keyCode === 72) { // H char
      this.handleUIClose();
    } else if (e.keyCode === 69) { // E char
      this.handleExpand();
    } else if (e.keyCode === 82 && !(e.metaKey || e.ctrlKey)) { // R char
      this.range.clear();
    } else if (e.keyCode === 37) { // Left arrow
      this.handleRewind();
    } else if (e.keyCode === 38) { // Up arrow
      e.preventDefault();

      const length = SPEEDS.length - 1;

      if (currentIndex === length) {
        return;
      }

      this.handleTimeScale(SPEEDS[currentIndex + 1]);
    } else if (e.keyCode === 40) { // Down arrow
      e.preventDefault();

      if (currentIndex === 0) {
        return;
      }

      this.handleTimeScale(SPEEDS[currentIndex - 1]);
    }
  }

  onResize = () => {
    const { isTablet: sIsTablet } = this.state;
    const isTablet = window.matchMedia('(max-width: 1020px)').matches;

    this.checkUIPosition(isTablet, sIsTablet);
  }

  checkUIPosition = (state, prevState) => {
    const { isExpanded } = this.state;

    if (!this.container) {
      return;
    }

    // We are resizing in the desktop view
    if (!state) {
      const { top, left } = this.container.getBoundingClientRect();
      const { tx, ty } = getMatrix(this.container);
      const x = left < 30 ? tx + parseInt(left, 10) : tx;
      const y = top < 30 ? ty + parseInt(top, 10) : ty;

      this.container.style.transform = `translate(${x}px, ${y}px)`;
      this.setState({ position: { x, y } });
    }

    // We are switching from one view to another
    if (state !== prevState) {
      this.setState({ isTablet: state });

      // We are in tablet view
      if (state) {
        // If the tool was expanded after switching
        // to tablet view, we minimize it again
        if (isExpanded) {
          this.handleExpand();
        }

        // If we are in tablet version, we need to remove the box position
        // value to avoid any issue while displaying the box
        this.container.style.removeProperty('transform');
        this.setState({ position: { x: 0, y: 0 } });

        storage.remove('BOX_POSITION');
      }
    }
  }

  onStoreChange = () => {
    // Get active animation from store
    const active = store.active();

    // Make sure active return a valid object
    if (isEmpty(active)) {
      return;
    }

    // Clear master to avoid
    // concatenating animations on master
    if (this.master) {
      this.master.clear();
    }

    // Add the active animation to the master
    this.master.add(active);

    // Check animation's status to define the master
    const isLoopStored = storage.get('LOOP') === 'true';
    const isPaused = active.paused();
    const isTween = get(active, 'data.isTween');
    const isInfinite = active.totalDuration() === 999999999999;
    const isLoop = isLoopStored || isInfinite;

    if (isInfinite) {
      const duration = active.duration();

      active.repeat(0);
      active.totalDuration(duration);
    }

    this.master.paused(isPaused);

    this.setState({
      playIcon: isPaused,
      active,
      isLoop,
      isTween,
      isInfinite,
    });

    this.initInOutWithStorage();

    // Re-render the UI box
    this.forceUpdate();
  }

  initUI = () => {
    // Read values from props and local storage and add fallbacks otherwise
    const storageIsVisible = JSON.parse(storage.get('IS_VISIBLE'));
    const isExpanded = JSON.parse(storage.get('IS_EXPANDED'));
    const isVisible = storageIsVisible === null ? this.props.isVisible : storageIsVisible;
    const timeScale = Number(storage.get('TIME_SCALE')) || 1;
    const isLoop = storage.get('LOOP') === 'true';
    const { x, y } = JSON.parse(storage.get('BOX_POSITION')) || { x: 0, y: 0 };

    this.setState({
      isVisible,
      isExpanded,
      isLoop,
      timeScale,
      position: { x, y },
    });

    this.master.timeScale(timeScale);

    // Wait few milliseconds to define the tool as loaded
    setTimeout(() => {
      this.setState({ isLoaded: true });
    }, 300);

    // If isVisible props is defined by default on
    // GsapTools component we set it on local storage
    storage.set('IS_VISIBLE', isVisible);
  }

  initInOutWithStorage = () => {
    // We retrieve data from local storage and enable a inOutMaster if we have
    // any in/outs markers in local storage, we also avoid to divide by zero
    const inPercent = Number(storage.get('IN_PERCENT')) || 0.01;
    const outPercent = Number(storage.get('OUT_PERCENT')) || 100;

    if (inPercent > 0.01 || outPercent < 100) {
      this.inTime = this.master.totalDuration() * (inPercent / 100);
      this.outTime = this.master.totalDuration() * (outPercent / 100);
      this.initInOut({ inTime: this.inTime, outTime: this.outTime });

      if (this.inOutMaster) {
        this.inOutMaster.restart();
      }
    }
  }

  handleUIClose = () => {
    if (this.isDragging && !this.state.isVisible) {
      return;
    }

    const { onClick, isVisible } = this.props;

    // If user choose his own way to display GsapTools
    if (onClick) {
      this.setState({ isVisible });

      return onClick();
    }

    const newState = !this.state.isVisible;

    // Build-in toggle for GsapTools
    this.setState({ isVisible: newState });

    // Set the isVisible value in local storage
    storage.set('IS_VISIBLE', newState);
  }

  handleDrag = () => {
    this.isDragging = true;
  }

  handleDragStop = (e, { x, y }) => {
    if (this.isDragging) {
      setTimeout(() => {
        this.isDragging = false;
      }, 200);
    } else {
      this.isDragging = false;
    }

    this.setState({ position: { x, y } });

    // Saving the box UI position
    storage.set('BOX_POSITION', JSON.stringify({ x, y }));
  }

  /*
   * Functions to manage GSAP's animations
   * All the methods here are made to control animations,
   * play/pause, loop, restart, timescale, markers, expand
   */

  initMaster = () => {
    // Init a master to wrap the child animation and be able to control it
    this.master = new TimelineMax({
      onUpdate: () => {
        this.setState({ value: this.master.progress() * 100 });
      },
      onComplete: () => {
        if (this.state.isLoop && !this.isChanging) {
          this.master.restart();
          this.setState({ playIcon: false });
        } else if (this.master.totalProgress() === 1) {
          this.master.pause();
          this.setState({ playIcon: true });
        } else if (this.outTime && this.master.totalProgress() === this.outTime) {
          this.setState({ playIcon: true });
        }
      },
    });
  }

  initInOut = ({ inTime, outTime } = {}) => {
    // If we reset the inTime to zero we don't want to play the inOutMaster
    if (inTime <= 0) {
      return;
    }

    // If inTime or outTime params are undefined, it means we just want to play/pause
    // the inOutMaster. We check the current status and toggle play/pause on both
    // inOutMaster and buttons…
    if (!inTime && !outTime && this.inOutMaster) {
      if (this.inOutMasterComplete) {
        this.inOutMaster.restart();
        this.setState({ playIcon: false });
      } else if (this.inOutMaster.paused()) {
        this.inOutMaster.play();
        this.setState({ playIcon: false });
      } else {
        this.inOutMaster.pause();
        this.setState({ playIcon: true });
      }

      return;
    }

    // … otherwise, if we have either inTime or outTime params defined, it means
    // we change the tweenFromTo values, so we need to create a new instance of
    // tweenFromTo from the master.
    this.inOutMaster = this.master.tweenFromTo(this.inTime, this.outTime, {
      onStart: () => {
        this.inOutMasterComplete = false;
      },
      onComplete: () => {
        this.inOutMasterComplete = true;

        if (this.state.isLoop) {
          this.inOutMaster.restart();
        } else {
          this.inOutMaster.pause();
          this.setState({ playIcon: true });
        }
      },
    }).pause();
  }

  handleList = ({ currentTarget }) => {
    // We get the animation from the store
    const active = store.active(currentTarget.value);

    // Make sure active return a valid object
    if (isEmpty(active)) {
      return;
    }

    // Check status of new child
    const isPaused = active.paused();
    const isTween = get(active, 'data.isTween');

    // Reset any markers if exists
    this.range.clear();

    // Remove css properties from previous animation
    clearProps(this.master);

    // We reset the previous animation to initial state
    // and clear it before adding the new one
    this.master.progress(0, false);
    this.master.clear();

    // We add the new animation, and restart
    this.master.add(active);

    // We play the animation if it was paused
    if (isPaused) {
      active.restart();
    }

    // And we restart the master
    this.master.restart();

    // We set the handle value at zero
    this.setState({
      playIcon: false,
      value: 0,
      active,
      isTween,
    });
  }

  handleTimeScale = (e) => {
    const value = typeof e === 'number' ? e : e.currentTarget.value;

    // Change the timescale on the master
    this.master.timeScale(value);

    // Also change it on the inOutMaster if it's initialized
    if (this.inOutMaster) {
      this.inOutMaster.timeScale(value);
    }

    // We set a state to send it to Header component
    this.setState({ timeScale: Number(value) });

    // Set the timeScale value in local storage to be pre-populated after reload
    storage.set('TIME_SCALE', value);
  }

  handleExpand = () => {
    const isExpanded = !this.state.isExpanded;

    this.setState({ isExpanded });

    // Set the isExpanded value in local storage
    storage.set('IS_EXPANDED', isExpanded);
  }

  handleRewind = () => {
    if (this.inTime || this.outTime) {
      // If inTime or outTime are defined, we want to control the inOutMaster
      // In this case, we check either if the inOutMaster is paused or not…
      if (this.inOutMaster.paused()) {
        this.inOutMaster.restart();
        this.inOutMaster.pause();
        this.setState({ playIcon: true });
      } else {
        this.inOutMaster.restart();
        this.setState({ playIcon: false });
      }
    } else if (this.master.paused()) {
      // … otherwise, it means we want to control the default master
      // We do the same by checking if the master is paused or not
      this.master.seek(0);
      this.setState({ value: 0, playIcon: true });
    } else {
      // And if the master is not paused, we just restart it
      this.master.restart();
      this.setState({ playIcon: false });
    }
  }

  handlePlayPause = () => {
    if (this.inTime || this.outTime) {
      // If inTime or outTime are defined we will handle the
      // play/pause state on the inOutMaster function
      this.initInOut();
    } else if (this.master.totalProgress() === 1) {
      // … otherwise, we check the status of the
      // master to know how to handle it
      this.master.restart();
      this.setState({ playIcon: false });
    } else if (this.master.paused()) {
      this.master.play();
      this.setState({ playIcon: false });
    } else {
      this.master.pause();
      this.setState({ playIcon: true });
    }
  }

  handleLoop = () => {
    const { isLoop } = this.state;

    this.setState({ isLoop: !isLoop });

    storage.set('LOOP', !isLoop);
  }

  handleRange = (value) => {
    // We use the isChanging flag to not start the master from the
    // beginning if it's looped and we are dragging the handle until the end
    this.isChanging = true;

    const progress = (value / 100).toFixed(2);

    this.setState({ value });
    this.master.progress(progress);
    this.progressTime = this.master.time() - this.inTime;
  }

  handleRangeStart = () => {
    // Let's keep in memory if the master or inOutMasters
    // were paused or not when we start dragging the handle
    this.masterWasPlaying = !this.master.paused();

    if (this.masterWasPlaying) {
      this.master.pause();
    }

    if (this.inOutMaster) {
      this.inOutMasterWasPlaying = !this.inOutMaster.paused();

      if (this.inOutMasterWasPlaying) {
        this.inOutMaster.pause();
      }
    }
  }

  handleRangeEnd = () => {
    this.isChanging = false;

    // After we release the handle, if master or inOutMasters
    // was playing when we started dragging, we will just resume them
    if (this.masterWasPlaying) {
      this.master.play();
    }

    if (this.inOutMaster) {
      this.inOutMaster.seek(this.progressTime);
    }

    if (this.inOutMaster && this.inOutMasterWasPlaying) {
      this.inOutMaster.play();
    }
  }

  handleMarkerInRange = (value) => {
    // We pause the inOutMaster if one is defined
    if (this.inOutMaster) {
      this.inOutMaster.pause();
    }

    this.master.pause();
    this.setState({ playIcon: true });

    if (value === 0) {
      this.inTime = 0;

      storage.remove('IN_PERCENT');
    } else {
      this.inTime = this.master.totalDuration() * (value / 100);
      this.master.seek(this.inTime);
      this.initInOut({ inTime: this.inTime });

      storage.set('IN_PERCENT', value);
    }
  }

  handleMarkerOutRange = (value) => {
    // We pause the inOutMaster if one is defined
    if (this.inOutMaster) {
      this.inOutMaster.pause();
    }

    this.master.pause();
    this.setState({ playIcon: true });

    if (value === 100) {
      this.outTime = undefined;

      storage.remove('OUT_PERCENT');
    } else {
      this.outTime = this.master.totalDuration() * (value / 100);
      this.initInOut({ outTime: this.outTime });

      storage.set('OUT_PERCENT', value);
    }
  }

  handleMarkerReset = () => {
    this.inTime = 0;
    this.outTime = undefined;

    if (this.inOutMaster) {
      this.inOutMaster.pause();
      this.inOutMaster.seek(0);
    }

    if (this.master) {
      this.master.pause();
      this.master.seek(0);
    }

    this.setState({
      value: 0,
      playIcon: true,
    });

    storage.remove('IN_PERCENT');
    storage.remove('OUT_PERCENT');
  }

  render() {
    const { onClick, isFixed } = this.props;
    const isActive = store.animations.size > 0;

    const {
      value,
      active,
      playIcon,
      timeScale,
      position: { x, y },
      isVisible,
      isExpanded,
      isLoop,
      isLoaded,
      isTablet,
      isTween,
      isInfinite,
    } = this.state;

    return (
      <Draggable
        handle={isVisible ? 'header' : 'button'}
        bounds="parent"
        onDrag={this.handleDrag}
        onStop={this.handleDragStop}
        position={{ x, y }}
        disabled={isTablet}
      >
        <div
          className={s(s.gsapTools, {
            [s.gsapToolsFixed]: isFixed,
            isExpanded,
            isVisible,
          })}
          ref={(el) => { this.container = el; }}
        >
          <div className={s.gsapTools__container}>
            <div className={s(s.gsapTools__box, { isLoaded, onClick })}>
              <Header
                keys={store.keys}
                master={this.master}
                timeScale={timeScale}
                isActive={isActive}
                isExpanded={isExpanded}
                isTween={isTween}
                isTablet={isTablet}
                isInfinite={isInfinite}
                onList={this.handleList}
                onTimeScale={this.handleTimeScale}
                onUIClose={this.handleUIClose}
                onExpand={this.handleExpand}
              />

              {(isExpanded && !isTablet) && (
                <Timeline
                  master={active}
                  isExpanded={isExpanded}
                  isTween={isTween}
                  onExpand={this.handleExpand}
                />
              )}

              <div className={s.gsapTools__wrapper}>
                <Controls
                  isPause={playIcon}
                  isLoop={isLoop}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  onRewind={this.handleRewind}
                  onPlayPause={this.handlePlayPause}
                  onLoop={this.handleLoop}
                />

                <Range
                  value={value}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  isTablet={isTablet}
                  onDrag={this.handleRange}
                  onDragStart={this.handleRangeStart}
                  onDragEnd={this.handleRangeEnd}
                  onDragMarkerIn={this.handleMarkerInRange}
                  onDragMarkerOut={this.handleMarkerOutRange}
                  onDragMarkerReset={this.handleMarkerReset}
                  ref={(el) => { this.range = el; }}
                />
              </div>
            </div>

            <Button
              isVisible={isVisible}
              isLoaded={isLoaded}
              onUIClose={this.handleUIClose}
              onClick={onClick}
            />
          </div>
        </div>
      </Draggable>
    );
  }
}

export default isClient ? GsapTools : (() => null);
