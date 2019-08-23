import React, { Component } from 'react';

import ClockSvg from './clock-svg.jsx';
import Handles from './handles.jsx';
import PlayPause from './play-pause.jsx';
import Readout from './readout.jsx';
import ResetButton from './reset-button.jsx';

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
        <ClockSvg
          minutes={Math.floor(this.state.seconds / 60)}
          seconds={this.state.seconds % 60}
          sessionMinutes={this.props.sessionMinutes}
        />
        <Readout
          seconds={this.state.seconds}
        />
        <PlayPause
          pause={this.pause}
          play={this.play}
          playing={!!this.state.interval}
        />
        <ResetButton
          playing={!!this.state.interval}
          reset={() => this.setSeconds(0)}
          seconds={this.state.seconds}
        />
        <Handles
          playing={!!this.state.interval}
          set={this.setSeconds}
          sessionMinutes={this.props.sessionMinutes}
        />
      </div>
    );
  }
}
