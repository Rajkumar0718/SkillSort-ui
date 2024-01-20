import React from 'react';
import Countdown from 'react-countdown';

// Random component
const TimeCounter = (props) => {
  const examTime = localStorage.getItem("examDuration")
  const otpTime = 0.50;
  const otpPath = window.location.pathname === '/company/register'

  // Renderer callback with condition

  const addZero = (time) => {
    return time <= 9 ? '0' + time : time
  }
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      if (!localStorage.getItem("examTimeUp") && !otpPath) {
        localStorage.setItem("examTimeUp", true)
        props.submittedConfirm();
      }
      else if (otpPath) {
        if (props) {
          props.otpTimeUp()
        }
        localStorage.setItem('otpTimeUp', true)
      }
      return "";
    } else {
      // Render a countdown
      return (<div>
        {hours === 0 ?
          <strong className="time-text">
            {addZero(minutes)}:{addZero(seconds)}
          </strong> :
          <strong className="time-text">
            {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
          </strong>}
      </div>);
    }
  };

  return (
    <Countdown
      date={
        otpPath
          ? new Date(localStorage.getItem("startDate")).getTime() + otpTime * 60 * 1000
          : new Date(localStorage.getItem("startDate")).getTime() + examTime * 60 * 1000
      }

      renderer={renderer}
    />
  )
}
export default TimeCounter;