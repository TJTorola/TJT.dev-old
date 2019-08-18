import React, { Component } from 'react';

import ClockSvg from './clock-svg.jsx';
import Readout from './readout.jsx';
import PlayPause from './play-pause.jsx';
import ResetButton from './reset-button.jsx';
import Handles from './handles.jsx';

export default class extends Component {
  state = {
    seconds: 0,
    interval: null,
  };

  play = () => {
    if (!!this.state.interval) return;

    const { seconds } = this.state;
    const then = Date.now() - (seconds * 1000);
    const interval = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - then) / 1000);
      this.setState({ seconds });
    }, 1000);

    this.setState({ interval });
  }

  pause = () => {
    clearInterval(this.state.interval);
    this.setState({ interval: null });
  }

  setSeconds = seconds => this.setState({ seconds });

  render() {
    return (
      <div className="timer">
        <div className="clock-wrapper">
          <ClockSvg
            seconds={this.state.seconds % 60}
            minutes={Math.floor(this.state.seconds / 60)}
          />
          <Readout
            seconds={this.state.seconds}
          />
          <PlayPause
            playing={!!this.state.interval}
            play={this.play}
            pause={this.pause}
          />
          <ResetButton
            seconds={this.state.seconds}
            playing={!!this.state.interval}
            reset={() => this.setSeconds(0)}
          />
          <Handles
            set={this.setSeconds}
            playing={!!this.state.interval}
          />
        </div>
      </div>
    );
  }
}
