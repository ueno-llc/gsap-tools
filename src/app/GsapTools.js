import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { observable } from 'mobx';
// import { inject, observer } from 'mobx-react';
import { TimelineLite, TweenLite } from 'gsap';

import Header from 'components/header';
import Controls from 'components/controls';
import Range from 'components/range';
import Button from 'components/button';

import s from './GsapTools.scss';

const PADDING = 20;

export default class GsapTools extends PureComponent {

  static propTypes = {
    listener: PropTypes.object,
    onClick: PropTypes.func,
    isVisible: PropTypes.bool,
  }

  // @observable
  // isVisible = false;

  // @observable
  // playIcon = true;

  // @observable
  // active;

  // @observable
  // progress;

  // @observable
  // value;

  // @observable
  // isLoop = false;

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      playIcon: true,
      active: undefined,
      value: undefined,
      isLoop: false,
    };

    this.setup(props);
  }

  setup = (props) => {
    const { isVisible, listener } = props || this.props;

    // Get the first timeline of the Map if one exist
    this.active = listener.active();

    // Is the GsapTools should be visible or hidden
    this.isVisible = isVisible;
  }

  componentDidMount() {
    setTimeout(() => {
      this.initUI();

      this.master = new TimelineLite({
        onUpdate: () => {
          this.value = this.master.progress() * 100;
          this.progress = this.master.time();
        },
        onComplete: () => {
          if (this.isLoop) {
            this.master.restart();
          } else if (this.master.totalProgress() === 1) {
            this.master.pause();
            this.playIcon = true;
          }
        },
      });

      this.master.add(this.active);
      this.playIcon = false;
    });
  }

  componentWillReceiveProps(props) {
    this.setup(props);
  }

  /*
   * Internal functions
   */

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
      this.isVisible = isVisible;
      return onClick();
    }

    this.isVisible = !this.isVisible;
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
    const active = this.props.listener.active(currentTarget.value);

    this.active = active;

    this.master.clear();
    this.master.add(this.active);
    this.master.play();
    this.master.seek(0);

    this.playIcon = false;
    this.value = 0;
  }

  handleTimeScale = ({ currentTarget }) => {
    this.master.timeScale(currentTarget.value);
  }

  handleRewind = () => {
    if (this.master.paused()) {
      this.playIcon = true;

      if (this.inTime > 0) {
        this.master.seek(this.inTime);
        this.value = this.inTime;
      } else {
        this.master.seek(0);
        this.value = 0;
      }
    } else {
      this.master.restart();
      this.playIcon = false;
    }
  }

  handlePlayPause = () => {
    if (this.master.totalProgress() === 1) {
      this.playIcon = false;
      this.master.restart();

      return;
    }

    if (this.master.paused()) {
      this.master.play();
      this.playIcon = false;
    } else {
      this.master.pause();
      this.playIcon = true;
    }
  }

  handleLoop = () => {
    this.isLoop = !this.isLoop;
  }

  handleRange = (value) => {
    this.value = value;
    this.master.progress(this.value / 100);
    this.progress = this.master.time();
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
    const { listener, onClick } = this.props;
    const visible = this.isVisible;

    return (
      <div
        className={s.gsapTools}
        ref={(c) => { this.container = c; }}
      >
        <div className={s.gsapTools__container}>
          <div className={s(s.gsapTools__box, { visible })}>
            <Header
              headerRef={(c) => { this.header = c; }}
              onMouseDown={this.handleUIBox}
              keys={listener.keys}
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
                paused={this.playIcon}
                looped={this.isLoop}
              />

              <Range
                value={this.value}
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
            visible={visible}
            onClick={onClick}
          />
        </div>
      </div>
    );
  }
}

// export default inject('listener')(observer(GsapTools));
