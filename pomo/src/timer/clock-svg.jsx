import React from 'react';

const SECONDS_RADIUS = 222; // width = 9
const BACK_RADIUS    = 233; // width = 32
const MINUTES_RADIUS = 238; // width = 23

// Perhaps the most tricky part of this whole timer is here, imagine that for the
// circle borders below there is a dash array (- - -) going around it, except that
// there is just one huge dash (set by strokeDasharray) that is as long has the
// circumference of whole circle. Then that one dash is offset by some amount to make
// it only cover part of the circle. That then appears to be like the Arc svg object
// going around just part of the circle.

// Why do this? Becuase I want to leverge CSS , and these are CSS values so that become trivial to
// to do compared to animating something like a SVG element.
const degsToDashoffset = (maxLength, deg) => maxLength - (maxLength * (deg / 360));

const setDashFromSec = seconds => {
  const maxLength = SECONDS_RADIUS * Math.PI * 2;
  const degrees = 360 * (seconds / 60);

  return {
    strokeDashoffset : degsToDashoffset(maxLength, degrees),
    strokeDasharray  : maxLength
  }
};

const setDashFromMin = (minutes, sessionMinutes) => {
  const maxLength = MINUTES_RADIUS * Math.PI * 2;
  const degrees = 360 * (minutes / sessionMinutes)

  return {
    strokeDashoffset : degsToDashoffset(maxLength, degrees),
    strokeDasharray  : maxLength
  }
};


export default ({ seconds, minutes, sessionMinutes }) => (
  <svg className="clock" viewBox="0 0 550 550" width="500px" height="500px" xmlns="http://www.w3.org/2000/svg">
    <circle className="back"
      cx="275"
      cy="275"
      r={ BACK_RADIUS }
    />
    <circle className="seconds"
      cx="275"
      cy="275"
      r={ SECONDS_RADIUS } 
      style={ setDashFromSec(seconds) }
    />
    <circle className="minutes" 
      cx="275"
      cy="275"
      r={ MINUTES_RADIUS } 
      style={ setDashFromMin(
        Math.min(sessionMinutes, minutes),
        sessionMinutes
      ) }
    />
  </svg>
);
