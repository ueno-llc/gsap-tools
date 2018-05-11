import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';

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

  componentDidMount() {
    store.on('change', this.onStoreChange);

    setTimeout(() => {
      this.master = new TimelineLite({
        onUpdate: () => {
          this.setState({
            value: this.master.progress() * 100,
          });
        },
        onComplete: () => {
          if (this.state.isLoop) {
            this.master.restart();
          } else if (this.master.totalProgress() === 1) {
            this.master.pause();
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

    const config = {
      type: 'x, y',
      edgeResistance: 0.65,
      bounds: document.body,
      throwProps: true,
    };

    if (isVisible) {
      Draggable.create(
        this.container,
        {
          ...config,
          trigger: this.header,
          snap: {
            x: endValue => parseInt(endValue, 10),
            y: endValue => parseInt(endValue, 10),
          },
        },
      );
    } else if (state.isVisible !== isVisible) {
      Draggable.create(
        this.container,
        {
          ...config,
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
    if (this.master.totalProgress() === 1) {
      this.setState({ playIcon: false });
      this.master.restart();

      return;
    }

    if (this.master.paused()) {
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

  handleMarkerInRange = (value) => {
    this.inTime = value;
  }

  handleMarkerRange = (value) => {
    this.outTime = value;
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
