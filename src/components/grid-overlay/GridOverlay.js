import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './GridOverlay.css';

const showGrid = process.env.NODE_ENV === 'development';
const LOCAL_STORAGE_KEY_VERTICAL = '_devtoolsVerticalGridVisible';

class GridOverlay extends PureComponent {

  static propTypes = {
    columns: PropTypes.number,
  }

  static defaultProps = {
    columns: 12,
  }

  state = {
    isVerticalVisible: false,
  }

  componentDidMount() {
    this.setup();

    document.addEventListener('keydown', this.keydownRef = this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownRef);
  }

  componentWillReceivePropclassnames(props) {
    this.setup(props);
  }

  onKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 76) {
      this.onToggleVertical();
    }
  }

  onToggleVertical = () => {
    const isVerticalVisible = !this.state.isVerticalVisible;

    this.setState({ isVerticalVisible });
    localStorage.setItem(LOCAL_STORAGE_KEY_VERTICAL, isVerticalVisible);
  }

  setup(props = null) {
    const { columns } = props || this.props;

    this.setState({
      isVerticalVisible: localStorage.getItem(LOCAL_STORAGE_KEY_VERTICAL) === 'true',
    });

    this.grid.style.setProperty('--grid-column-count', columns);
  }

  render() {
    const { columns } = this.props;
    const { isVerticalVisible } = this.state;

    return (
      <div
        className={classnames('grid', { isVerticalVisible })}
        ref={(el) => { this.grid = el; }}
      >
        <div className="grid__container">
          <div className="grid__row" data-columns={columns}>
            {Array(columns).fill(0).map((_, i) => (
              <div key={`grid_column_${i}`} className="grid__column">
                <div className="grid__visualize" />
              </div>
            ))}
          </div>
        </div>

        <button key="v" className={classnames('grid__button', { isVerticalVisible })} onClick={this.onToggleVertical}>
          <svg className="grid__button__svg" width="14px" height="14px" viewBox="0 0 14 14">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <rect x="0" y="0" width="2" height="14" />
              <rect x="4" y="0" width="2" height="14" />
              <rect x="8" y="0" width="2" height="14" />
              <rect x="12" y="0" width="2" height="14" />
            </g>
          </svg>
        </button>
      </div>
    );
  }
}

export default showGrid ? GridOverlay : (() => null);
