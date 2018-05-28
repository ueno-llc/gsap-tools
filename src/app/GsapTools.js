import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import TimelineMax from 'gsap/TimelineMax';
import storage from 'utils/storage';

import Header from 'components/header';
import Controls from 'components/controls';
import Range from 'components/range';
import Button from 'components/button';

import store from 'store';

import s from './GsapTools.scss';

export default class GsapTools extends PureComponent {

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

    this.state = {
      isLoaded: false,
      isVisible: props.isVisible,
      playIcon: true,
      value: 0,
      isLoop: false,
      timeScale: 1,
      position: { x: 0, y: 0 },
    };
  }

  componentDidMount() {
    // Add a store's listener for changes
    store.on('change', this.onStoreChange);

    // Init the master timeline which will contain timelines to debug
    this.initMaster();

    // Init controls from localstorage values
    this.initUI();
  }

  componentWillReceiveProps(props) {
    if (props.isVisible !== this.props.isVisible) {
      this.setState({ isVisible: props.isVisible });
    }
  }

  componentWillUnmount() {
    // Remove the store's listener when unmouting the component
    store.removeListener('change', this.onStoreChange);
  }

  /*
   * Internal functions
   * They are mainly made to drag, toggle the ui
   * and init the saved preferences
   */

  onStoreChange = () => {
    // Register new timeline (We need a setTimeout to get the
    // ref to `this.range` from <Range /> component available)
    setTimeout(this.handleStoreChange);

    // Re-render the UI box
    this.forceUpdate();
  }

  handleStoreChange = () => {
    // Clear master timeline between page navigation
    if (this.master) {
      this.master.clear();
    }

    // Clear in/out markers between page navigation
    if (this.range) {
      this.range.clear();
    }

    // Get active timeline from store
    const active = store.active();

    if (!active) {
      return;
    }

    // Add the active timeline to the master one
    this.master.add(active);

    // If on a previous page we waited until the end of the timeline
    // we need to restart it for the new one registered from the new page
    this.master.restart();

    this.setState({
      playIcon: false,
      isLoaded: true,
    });
  }

  initUI = () => {
    // Read values from props, localStorage and fallbacks
    const storageIsVisible = JSON.parse(storage.get('IS_VISIBLE'));
    const isVisible = storageIsVisible === null ? this.props.isVisible : storageIsVisible;
    const timeScale = Number(storage.get('TIME_SCALE')) || 1;
    const isLoop = storage.get('LOOP') === 'true';
    const { x, y } = JSON.parse(storage.get('BOX_POSITION')) || { x: 0, y: 0 };

    this.setState({
      position: { x, y },
      isVisible,
      isLoop,
      timeScale,
    });

    this.master.timeScale(timeScale);

    const inPercent = Number(storage.get('IN_PERCENT')) || 0;
    const outPercent = Number(storage.get('OUT_PERCENT')) || 100;

    // If inPercent and outPercent are defined it means we want
    // an inOutMaster timeline so we have to init it
    if (inPercent > 0 || outPercent < 100) {
      this.inTime = this.master.totalDuration() * (inPercent / 100);
      this.outTime = this.master.totalDuration() * (outPercent / 100);
      this.initInOut({ inTime: this.inTime, outTime: this.outTime });
    }

    // If isVisible props is defined by default on gsap-tools
    // component we set it on localStorage
    storage.set('IS_VISIBLE', isVisible);
  }

  handleUIClose = () => {
    const { onClick, isVisible } = this.props;

    // If user choose his own way to display gsap-tools
    if (onClick) {
      this.setState({ isVisible });

      return onClick();
    }

    const newState = !this.state.isVisible;

    // Build-in toggle for gsap-tools
    this.setState({ isVisible: newState });

    // Set the isVisible value in localStorage
    storage.set('IS_VISIBLE', newState);
  }

  handleDragStop = (e, { x, y }) => {
    this.setState({ position: { x, y } });

    // Saving the box UI position
    storage.set('BOX_POSITION', JSON.stringify({ x, y }));
  }

  /*
   * Functions to manage GSAP's timelines
   * All the methods here are made to control timeline,
   * play/pause, loop, restart, timescale, markers
   */

  initMaster = () => {
    // Init a master timeline to wrap the child timeline to control it
    this.master = new TimelineMax({
      onUpdate: () => {
        this.setState({ value: this.master.progress() * 100 });
      },
      onComplete: () => {
        if (this.state.isLoop) {
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
    // If we reset the inTime to zero we don't want to play the timeline
    if (inTime <= 0) {
      return;
    }

    // If inTime or outTime params are undefined, it means we just want to play/pause
    // the timeline. We check the current status and toggle play/pause on both
    // timeline and button…
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
    // tweenFromTo from the master timeline.
    this.inOutMaster = this.master.tweenFromTo(this.inTime, this.outTime, {
      onStart: () => {
        this.inOutMasterComplete = false;
      },
      onComplete: () => {
        this.inOutMasterComplete = true;

        if (this.state.isLoop) {
          this.inOutMaster.restart();
        } else {
          this.setState({ playIcon: true });
        }
      },
    }).pause();
  }

  handleList = ({ currentTarget }) => {
    // We get the timeline from the store
    const active = store.active(currentTarget.value);

    // Reset any markers if exists
    this.range.clear();

    // We reset the previous timeline to initial state and clear it before adding the new one
    this.master.progress(0, false);
    this.master.clear();

    // We add the new timeline, and restart
    this.master.add(active);
    this.master.restart();

    // We set the handle value at zero
    this.setState({
      playIcon: false,
      value: 0,
    });
  }

  handleTimeScale = ({ currentTarget }) => {
    const { value } = currentTarget;

    // Change the timescale on the master timeline
    this.master.timeScale(value);

    // Also change it on the inOutMaster timeline if initialized
    if (this.inOutMaster) {
      this.inOutMaster.timeScale(value);
    }

    // We set a state to send it to Header component
    this.setState({ timeScale: value });

    // Set the timeScale value in localStorage to be pre-populated after reload
    storage.set('TIME_SCALE', value);
  }

  handleRewind = () => {
    if (this.inTime || this.outTime) {
      // If inTime or outTime are defined, we want to control the inOutTimeline
      // In this case, we check either if the inOutMaster timeline is paused or not

      if (this.inOutMaster.paused()) {
        this.inOutMaster.restart();
        this.inOutMaster.pause();
        this.setState({ playIcon: true });
      } else {
        this.inOutMaster.restart();
        this.setState({ playIcon: false });
      }
    } else if (this.master.paused()) {
      // Otherwise, it means we want to control the default master timeline
      // We do the same by checking if the master timeline is paused or not

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
      this.initInOut();
    } else if (this.master.totalProgress() === 1) {
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
    const progress = (value / 100).toFixed(2);

    this.setState({ value });
    this.master.progress(progress);
  }

  handleRangeStart = () => {
    // Let's keep in memory if the master or inOutMaster timelines
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
    // After we release the handle, if master or inOutMaster timelines
    // was playing when we started dragging, we will just resume them
    if (this.masterWasPlaying) {
      this.master.play();
    }

    if (this.inOutMaster && this.inOutMasterWasPlaying) {
      this.inOutMaster.play();
    }
  }

  handleMarkerInRange = (value) => {
    if (this.inOutMaster) {
      this.inOutMaster.pause();
    }

    this.master.pause();
    this.setState({ playIcon: true });
    this.inTime = this.master.totalDuration() * (value / 100);
    this.master.seek(this.inTime);
    this.initInOut({ inTime: this.inTime });

    storage.set('IN_PERCENT', value);
  }

  handleMarkerOutRange = (value) => {
    if (this.inOutMaster) {
      this.inOutMaster.pause();
    }

    this.master.pause();
    this.setState({ playIcon: true });
    this.outTime = this.master.totalDuration() * (value / 100);
    this.initInOut({ outTime: this.outTime });

    storage.set('OUT_PERCENT', value);
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
    const isActive = store.timelines.size > 0;

    const {
      isVisible,
      isLoop,
      playIcon,
      value,
      timeScale,
      isLoaded,
      position: { x, y },
    } = this.state;

    return (
      <Draggable
        handle="header"
        bounds="parent"
        onStop={this.handleDragStop}
        position={{ x, y }}
      >
        <div
          className={s(s.gsapTools, { [s.gsapToolsFixed]: isFixed })}
          ref={(el) => { this.container = el; }}
        >
          <div className={s.gsapTools__container}>
            <div className={s(s.gsapTools__box, { isLoaded, isVisible, onClick })}>
              <Header
                keys={store.keys}
                handleList={this.handleList}
                handleTimeScale={this.handleTimeScale}
                handleUIClose={this.handleUIClose}
                master={this.master}
                timeScale={timeScale}
                isActive={isActive}
              />

              <section className={s.gsapTools__inner}>
                <Controls
                  handleRewind={this.handleRewind}
                  handlePlayPause={this.handlePlayPause}
                  handleLoop={this.handleLoop}
                  isPause={playIcon}
                  isLoop={isLoop}
                  isActive={isActive}
                />

                <Range
                  value={value}
                  isActive={isActive}
                  onDrag={this.handleRange}
                  onDragStart={this.handleRangeStart}
                  onDragEnd={this.handleRangeEnd}
                  onDragMarkerIn={this.handleMarkerInRange}
                  onDragMarkerOut={this.handleMarkerOutRange}
                  onDragMarkerReset={this.handleMarkerReset}
                  ref={(el) => { this.range = el; }}
                />
              </section>
            </div>

            <Button
              handleUIClose={this.handleUIClose}
              visible={isVisible}
              onClick={onClick}
            />
          </div>
        </div>
      </Draggable>
    );
  }
}
