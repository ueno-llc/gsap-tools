import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineMax } from 'gsap';

import Header from 'components/header';
import Controls from 'components/controls';
import Range from 'components/range';
import Button from 'components/button';

import store from 'store';

import 'styles/fonts.scss';

import s from './GsapTools.scss';

export default class GsapTools extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    isVisible: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      isVisible: props.isVisible,
      playIcon: true,
      value: 0,
      isLoop: false,
    };
  }

  inTime = 0

  componentDidMount() {
    store.on('change', this.onStoreChange);

    setTimeout(() => {
      this.initDraggable();

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

      this.master.add(store.active());
      this.setState({ playIcon: false });
    });
  }

  componentDidUpdate(props, state) {
    const { isVisible } = this.state;

    if (isVisible) {
      if (this.headerDraggable) {
        this.headerDraggable[0].enable();
      }

      if (this.buttonDraggable) {
        this.buttonDraggable[0].disable();
      }
    } else if (state.isVisible !== isVisible) {
      if (this.headerDraggable) {
        this.headerDraggable[0].disable();
      }

      this.buttonDraggable = Draggable.create(
        this.container,
        {
          ...this.config,
          trigger: this.button,
          onClick: () => {
            this.handleUIClose();
          },
        },
      );
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ isVisible: props.isVisible });
  }

  componentWillUnmount() {
    store.removeListener('change', this.onStoreChange);
  }

  /*
   * Internal functions
   */

  initDraggable = () => {
    this.config = {
      type: 'x, y',
      edgeResistance: 0.65,
      bounds: document.body,
      throwProps: true,
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
    );
  }

  onStoreChange = () => {
    // Re-render the UI box
    this.forceUpdate();
  }

  handleUIClose = () => {
    const { onClick, isVisible } = this.props;

    if (onClick) {
      this.setState({ isVisible });

      return onClick();
    }

    this.setState({ isVisible: !this.state.isVisible });
  }

  /*
   * Functions to manage GSAP's timelines
   */

  handleList = ({ currentTarget }) => {
    const active = store.active(currentTarget.value);

    this.master.clear();
    this.master.add(active);
    this.master.play();
    this.master.seek(0);

    this.setState({
      playIcon: false,
      value: 0,
    });
  }

  handleTimeScale = ({ currentTarget }) => {
    this.master.timeScale(currentTarget.value);
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
      this.setState({ playIcon: false });
      this.master.seek(this.inTime);

      this.markersMaster = this.master.tweenFromTo(this.inTime, this.outTime, {
        onComplete: () => {
          if (this.state.isLoop) {
            this.markersMaster.restart();
          } else {
            this.setState({ playIcon: true });
          }
        },
      });
    } else if (this.master.totalProgress() === 1) {
      this.setState({ playIcon: false });
      this.master.restart();
    } else if (this.master.paused()) {
      this.master.play();
      this.setState({ playIcon: false });
    } else {
      this.master.pause();
      this.setState({ playIcon: true });
    }
  }

  handleLoop = () => {
    this.setState({ isLoop: !this.state.isLoop });
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
    this.master.pause();
    this.setState({ playIcon: true });
    this.inTime = this.master.totalDuration() * (value / 100);
    this.master.seek(this.inTime);
  }

  handleMarkerRange = (value) => {
    this.master.pause();
    this.setState({ playIcon: true });
    this.outTime = this.master.totalDuration() * (value / 100);
  }

  handleMarkerReset = () => {
    this.inTime = 0;
    this.outTime = undefined;

    this.markersMaster.pause();
    this.master.pause();

    this.markersMaster.seek(0);
    this.master.seek(0);

    this.setState({
      value: 0,
      playIcon: true,
    });
  }

  render() {
    const { onClick } = this.props;
    const { isVisible, isLoop, playIcon, value } = this.state;

    return (
      <div className={s.gsapTools} ref={(c) => { this.container = c; }}>
        <div className={s.gsapTools__container}>
          <div className={s(s.gsapTools__box, { isVisible })}>
            <Header
              headerRef={(c) => { this.header = c; }}
              keys={store.keys}
              handleList={this.handleList}
              handleTimeScale={this.handleTimeScale}
              handleUIClose={this.handleUIClose}
              master={this.master}
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
                onDragMarkerOut={this.handleMarkerRange}
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
