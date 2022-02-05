import React from 'react';

const RADIUS = 240;

const handleStyle = (minute, sessionMinutes) => {
  const radians = ((2 * Math.PI) / sessionMinutes) * minute;
  const degrees = (360 / sessionMinutes) * minute;

  return {
    left: (Math.sin(radians) + 1) * RADIUS - 3,
    bottom: (Math.cos(radians) + 1) * RADIUS + 7,
    transform: `rotate(${degrees}deg)`
  };
};

export default ({ set, playing, sessionMinutes }) => (
  <div className={ !playing ? "handles paused" : "handles" }>
    {[...new Array(sessionMinutes)].map((_, i) => (
      <div
        key={i}
        className="handle"
        style={handleStyle(i, sessionMinutes)}
        onClick={
          playing
            ? () => {}
            : () => {set(60 * i);}
        }
      >
        <div className="bar" />
      </div>
    ))}
  </div>
);
