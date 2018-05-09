import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite, TweenLite } from 'gsap';

import Header from 'components/header';
import Controls from 'components/controls';
import Range from 'components/range';
import Button from 'components/button';

import store from 'store';

import 'styles/fonts.scss';

import s from './GsapTools.scss';

const PADDING = 20;

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
      active: undefined,
      value: 0,
      isLoop: false,
    };
  }

  setup = (props) => {
    const { isVisible } = props || this.props;

    // Get the first timeline of the Map if one exist
    this.setState({
      active: store.test,
      isVisible,
    });
  }

  componentDidMount() {
    store.on('change', this.onStoreChange);

    setTimeout(() => {
      this.initUI();

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

      console.log('-------store.active()', store.active());

      this.master.add(store.test);
      this.setState({ playIcon: false });
    });
  }

  componentWillReceiveProps(props) {
    this.setup(props);
  }

  componentWillUnmount() {
    store.removeListener('change', this.onStoreChange);
  }

  /*
   * Internal functions
   */

  onStoreChange = () => {
    console.log('change', store);
    console.log('change', store.active());

    // temp
    this.forceUpdate();
  }

  initUI = () => {
    if (!this.container) {
      return;
    }

    const { innerWidth, innerHeight } = window;
    const { width: cw, height: ch } = this.container.getBoundingClientRect();

    TweenLite.set(
      this.container,
      {
        top: innerHeight - ch - PADDING,
        left: innerWidth - cw - PADDING - 14,
      },
    );
  }

  handleUIClose = () => {
    const { onClick, isVisible } = this.props;

    if (onClick) {
      this.setState({ isVisible });
      return onClick();
    }

    this.setState({ isVisible: !isVisible });
  }

  mouseEvent = (e) => {
    const x = !e.touches ? e.clientX : e.touches[0].clientX;
    const y = !e.touches ? e.clientY : e.touches[0].clientY;

    return {
      x,
      y,
    };
  }

  handleUIBoxPosition = (e) => {
    const { width: hw, height: hh, top: ht, left: hl } = this.header.getBoundingClientRect();
    const { width: cw, height: ch, top: ct, left: cl } = this.container.getBoundingClientRect();

    const x = hw - (hw - (this.mouseEvent(e).x - hl));
    const y = hh - (hh - (this.mouseEvent(e).y - ht));

    const top = ch - (ch - (this.mouseEvent(e).y - ct));
    const left = cw - (cw - (this.mouseEvent(e).x - cl));
    const right = cw - left;
    const bottom = ch - top;

    this.drag = {
      top,
      right,
      bottom,
      left,
      x,
      y,
    };
  }

  handleUIBox = (e) => {
    this.handleUIBoxPosition(e);

    document.addEventListener('mousemove', this.handleUIBoxDrag);
    document.addEventListener('mouseup', this.handleUIBoxEnd);
  }

  handleUIBoxDrag = (e) => {
    if (!this.container) {
      return;
    }

    const pos = this.mouseEvent(e);
    const { innerWidth, innerHeight } = window;
    const { top, right, bottom, left, x, y } = this.drag;

    if (
      (pos.x - PADDING) < left ||
      (pos.y - PADDING) < top ||
      (pos.x + right) > (innerWidth - PADDING) ||
      (pos.y + bottom) > (innerHeight - PADDING)
    ) {
      return;
    }

    TweenLite.set(
      this.container,
      {
        top: pos.y - y,
        left: pos.x - x,
      },
    );
  }

  handleUIBoxEnd = () => {
    document.removeEventListener('mousemove', this.handleUIBoxDrag);
    document.removeEventListener('mouseup', this.handleUIBoxEnd);
  }

  /*
   * Functions to manage GSAP's timelines
   */

  handleList = ({ currentTarget }) => {
    const active = store.active(currentTarget.value);

    this.setState({
      active,
      playIcon: false,
    });

    this.master.clear();
    this.master.add(active);
    this.master.play();
    this.master.seek(0);

    this.setState({ value: 0 });
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

    console.log('');
    console.log('');
    console.log('store keys', store.keys);

    return (
      <div
        className={s.gsapTools}
        ref={(c) => { this.container = c; }}
      >
        <div className={s.gsapTools__container}>
          <div className={s(s.gsapTools__box, { isVisible })}>
            <Header
              headerRef={(c) => { this.header = c; }}
              onMouseDown={this.handleUIBox}
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
    );
  }
}
