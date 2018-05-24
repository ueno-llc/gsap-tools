import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineMax } from 'utils/gsap';
import { LOCAL_STORAGE } from 'utils/constants';

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

  constructor(props) {
    super(props);

    this.inTime = 0;

    this.state = {
      id: undefined,
      isVisible: props.isVisible,
      playIcon: true,
      value: 0,
      isLoop: false,
      timeScale: 1,
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
    this.setState({ isVisible: props.isVisible });
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
    const id = localStorage.getItem(LOCAL_STORAGE.ACTIVE);

    // Clear master timeline between page navigation
    if (this.master) {
      this.master.clear();
    }

    // Clear in/out markers between page navigation
    if (this.range) {
      this.range.clear();
    }

    // Get active timeline from store
    const active = store.active(id);
    
    if (!active) {
      return;
    }

    // Add the active timeline to the master one
    this.setState({ id });
    this.master.add(active);

    // If on a previous page we waited until the end of the timeline
    // we need to restart it for the new one registered from the new page
    this.master.restart();
    this.setState({ playIcon: false });
  }

  initUI = () => {
    const isVisible = localStorage.getItem(LOCAL_STORAGE.IS_VISIBLE) === 'true';
    const active = localStorage.getItem(LOCAL_STORAGE.ACTIVE);
    const timeScale = Number(localStorage.getItem(LOCAL_STORAGE.TIME_SCALE)) || 1;
    const isLoop = localStorage.getItem(LOCAL_STORAGE.LOOP) === 'true';
    // console.log('-initUI active', active);

    this.setState({
      id: active,
      isVisible,
      isLoop,
      timeScale,
    });

    this.master.timeScale(timeScale);

    const inPercent = Number(localStorage.getItem(LOCAL_STORAGE.IN_PERCENT)) || 0;
    const outPercent = Number(localStorage.getItem(LOCAL_STORAGE.OUT_PERCENT)) || 100;

    if (inPercent > 0 || outPercent < 100) {
      this.inTime = this.master.totalDuration() * (inPercent / 100);
      this.outTime = this.master.totalDuration() * (outPercent / 100);
      this.initInOut({ inTime: this.inTime, outTime: this.outTime });
    }
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
    localStorage.setItem(LOCAL_STORAGE.IS_VISIBLE, newState);
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
    const id = currentTarget.value;

    console.log('-handleList', id);

    // We get the timeline from the store
    const active = store.active(id);

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
      id,
      playIcon: false,
      value: 0,
    });

    // Set the active timeline id in localStorage to be pre-populated after reload
    localStorage.setItem(LOCAL_STORAGE.ACTIVE, id);
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
    localStorage.setItem(LOCAL_STORAGE.ACTIVE, value);
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

    localStorage.setItem(LOCAL_STORAGE.LOOP, !isLoop);
  }

  handleRange = (value) => {
    this.setState({ value });
    this.master.progress(value / 100);
  }

  handleRangeStart = () => {
    // Let's keep in memory if the master timeline was paused or not
    // when we start dragging the handle
    this.wasPlaying = !this.master.paused();

    if (this.wasPlaying) {
      this.master.pause();
    }
  }

  handleRangeEnd = () => {
    // After we release the handle, if the timeline was playing when
    // we started dragging, we will just resume it
    if (this.wasPlaying) {
      this.master.play();
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

    localStorage.setItem(LOCAL_STORAGE.IN_PERCENT, value);
  }

  handleMarkerOutRange = (value) => {
    if (this.inOutMaster) {
      this.inOutMaster.pause();
    }

    this.master.pause();
    this.setState({ playIcon: true });
    this.outTime = this.master.totalDuration() * (value / 100);
    this.initInOut({ outTime: this.outTime });

    localStorage.setItem(LOCAL_STORAGE.OUT_PERCENT, value);
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

    localStorage.removeItem(LOCAL_STORAGE.IN_PERCENT);
    localStorage.removeItem(LOCAL_STORAGE.OUT_PERCENT);
  }

  render() {
    const { onClick, isFixed } = this.props;
    const { isVisible, isLoop, playIcon, value, timeScale, id } = this.state;
    const isActive = store.timelines.size > 0;

    return (
      <div
        className={s(s.gsapTools, { [s.gsapToolsFixed]: isFixed })}
        ref={(c) => { this.container = c; }}
      >
        <div className={s.gsapTools__container}>
          <div className={s(s.gsapTools__box, { isVisible, onClick })}>
            <Header
              headerRef={(c) => { this.header = c; }}
              keys={store.keys}
              handleList={this.handleList}
              handleTimeScale={this.handleTimeScale}
              handleUIClose={this.handleUIClose}
              master={this.master}
              timeScale={timeScale}
              isActive={isActive}
              id={id}
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
                ref={(c) => { this.range = c; }}
              />
            </section>
          </div>

          <Button
            buttonRef={(c) => { this.button = c; }}
            handleUIClose={this.handleUIClose}
            visible={isVisible}
            onClick={onClick}
          />
        </div>
      </div>
    );
  }
}
