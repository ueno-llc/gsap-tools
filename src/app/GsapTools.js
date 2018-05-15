import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineMax, TweenLite } from 'gsap';

import Header from 'components/header';
import Controls from 'components/controls';
import Range from 'components/range';
import Button from 'components/button';

import store from 'store';

import s from './GsapTools.scss';

const LOCAL_STORAGE = {
  LOOP: '_gsapToolsIsLoop',
  TIME_SCALE: '_gsapToolsTimeScale',
  BOX_POSITION: '_gsapToolsBoxPosition',
};

export default class GsapTools extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    isVisible: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.inTime = 0;

    this.state = {
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

    setTimeout(() => {
      this.initMaster();
      this.initWithStorage();
      this.initDraggable();
    });
  }

  componentDidUpdate(props, state) {
    const { isVisible } = this.state;

    if (isVisible) {
      if (this.headerDraggable) {
        this.headerDraggable.enable();
      }

      if (this.buttonDraggable) {
        this.buttonDraggable.disable();
      }
    } else if (state.isVisible !== isVisible) {
      if (this.headerDraggable) {
        this.headerDraggable.disable();
      }

      this.buttonDraggable = Draggable.create(
        this.container,
        {
          ...this.config,
          trigger: this.button,
          onClick: this.handleUIClose,
        },
      )[0];
    }
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
    // Re-render the UI box
    this.forceUpdate();
  }

  initWithStorage = () => {
    const timeScale = Number(localStorage.getItem(LOCAL_STORAGE.TIME_SCALE)) || 1;
    const isLoop = localStorage.getItem(LOCAL_STORAGE.LOOP) === 'true';
    const box = JSON.parse(localStorage.getItem(LOCAL_STORAGE.BOX_POSITION));

    if (box) {
      const { x, y } = box;

      TweenLite.set(
        this.container,
        {
          x,
          y,
        },
      );
    }

    this.setState({
      isLoop,
      playIcon: false,
      timeScale,
    });

    this.master.timeScale(timeScale);
    this.master.add(store.active());
  }

  initDraggable = () => {
    this.config = {
      type: 'x, y',
      edgeResistance: 0.65,
      bounds: document.body,
      throwProps: true,
      onDragEnd() {
        const obj = { x: this.endX, y: this.endY };

        localStorage.setItem(LOCAL_STORAGE.BOX_POSITION, JSON.stringify(obj));
      },
    };

    this.headerDraggable = Draggable.create(
      this.container,
      {
        ...this.config,
        trigger: this.header,
        snap: {
          x: endValue => parseInt(endValue, 10),
          y: endValue => parseInt(endValue, 10),
        },
      },
    )[0];
  }

  handleUIClose = () => {
    const { onClick, isVisible } = this.props;

    // If user choose his own way to display gsap-tools
    if (onClick) {
      this.setState({ isVisible });

      return onClick();
    }

    // Build-in toggle for gsap-tools
    this.setState({ isVisible: !this.state.isVisible });
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
    // If inTime or outTime params are undefined, it means we just want to play/pause
    // the timeline. We check the current status and toggle play/pause on both
    // timeline and button…
    if (!inTime && !outTime && this.inOutMaster) {
      if (this.inOutMaster.paused()) {
        this.inOutMaster.play();
        this.setState({ playIcon: false });
      } else if (this.inOutMasterComplete) {
        this.inOutMaster.restart();
        this.setState({ playIcon: false });
      } else if (this.inOutMaster.totalDuration() === this.outTime) {
        this.setState({ playIcon: true });
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
        }
      },
    }).pause();
  }

  handleList = ({ currentTarget }) => {
    // We store the active GSAP timeline in the store
    const active = store.active(currentTarget.value);

    // We clear the previous timeline before adding the new one
    this.master.clear();

    // We add the new timeline, and seek to 0 to start it from beginning
    this.master.add(active);
    this.master.seek(0);

    // We set the handle value at zero
    this.setState({
      playIcon: false,
      value: 0,
    });

    // We finally play the new timeline
    this.master.play();
  }

  handleTimeScale = ({ currentTarget }) => {
    const { value } = currentTarget;

    // We get the value from the select option, and we set it on the
    // master timeline, and set a state to send it to Header component
    this.master.timeScale(value);
    this.setState({ timeScale: value });

    // Set the timeScale value in localStorage to be pre-populated after reload
    localStorage.setItem(LOCAL_STORAGE.TIME_SCALE, value);
  }

  handleRewind = () => {
    if (this.master.paused()) {
      this.setState({ playIcon: true });

      if (this.inTime > 0) {
        this.master.seek(this.inTime);
        this.setState({ value: this.inTime });
      } else {
        this.master.seek(0);
        this.setState({ value: 0 });
      }
    } else {
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
    this.wasPlaying = !this.master.paused();

    if (this.wasPlaying) {
      this.master.pause();
    }
  }

  handleRangeEnd = () => {
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

    localStorage.setItem(LOCAL_STORAGE.IN_TIME, this.inTime);
  }

  handleMarkerOutRange = (value) => {
    if (this.inOutMaster) {
      this.inOutMaster.pause();
    }

    this.master.pause();
    this.setState({ playIcon: true });
    this.outTime = this.master.totalDuration() * (value / 100);
    this.initInOut({ outTime: this.outTime });

    localStorage.setItem(LOCAL_STORAGE.OUT_TIME, this.outTime);
  }

  handleMarkerReset = () => {
    this.inTime = 0;
    this.outTime = undefined;

    this.inOutMaster.pause();
    this.master.pause();

    this.inOutMaster.seek(0);
    this.master.seek(0);

    this.setState({
      value: 0,
      playIcon: true,
    });
  }

  render() {
    const { onClick } = this.props;
    const { isVisible, isLoop, playIcon, value, timeScale } = this.state;

    return (
      <div className={s.gsapTools} ref={(c) => { this.container = c; }}>
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
            />

            <section className={s.gsapTools__inner}>
              <Controls
                handleRewind={this.handleRewind}
                handlePlayPause={this.handlePlayPause}
                handleLoop={this.handleLoop}
                paused={playIcon}
                looped={isLoop}
              />

              <Range
                value={value}
                onDrag={this.handleRange}
                onDragStart={this.handleRangeStart}
                onDragEnd={this.handleRangeEnd}
                onDragMarkerIn={this.handleMarkerInRange}
                onDragMarkerOut={this.handleMarkerOutRange}
                onDragMarkerReset={this.handleMarkerReset}
                hasTimeline={store.keys.length > 0}
              />
            </section>
          </div>

          <Button
            buttonRef={(c) => { this.button = c; }}
            visible={isVisible}
            onClick={onClick}
          />
        </div>
      </div>
    );
  }
}
