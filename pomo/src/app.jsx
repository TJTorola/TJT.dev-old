import React, { Component } from 'react';

import Timer from './timer/index.jsx';

export default class extends Component {
  state = {
    sessionMinutes: 15,
  }

  render() {
    return (
      <main>
        <Timer sessionMinutes={this.state.sessionMinutes} />
      </main>
    );
  }
};

