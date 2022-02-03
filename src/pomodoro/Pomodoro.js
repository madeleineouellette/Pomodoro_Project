import React, { useEffect, useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration";
import { secondsToDuration } from "../utils/duration";
import FocusTimer from "../FocusTimer.js";
import BreakTimer from "../BreakTimer.js";
import ProgressBar from "../ProgressBar";


// These functions are defined outside of the component to ensure they do not have access to state
// and are, therefore, more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  const duration = prevState.duration
  return {
    ...prevState,
    timeRemaining,
    duration,
  };
}

/**
 * Higher-order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
        duration: breakDuration
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
      duration: focusDuration
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.

    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [ariaValue, setAriaValue] = useState(0);


  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You won't need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
         setSession(nextSession(focusDuration, breakDuration));
      }
       setSession(nextTick)
       const timeLeft = session.timeRemaining
       if (session.label === "Focusing"){
         setAriaValue(100 * (focusDuration * 60 - timeLeft)/(focusDuration * 60))
       }
       else  {
         setAriaValue(100 * (breakDuration * 60 - timeLeft)/(breakDuration * 60))
       }
    },
    isTimerRunning ? 1000 : null);

//progress bar - session divided by total duration



  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
              duration: focusDuration
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }


  // create handler for Increase button for Focus
  const increaseFocusButtonHandler = (event) => {
    event.preventDefault();
    if (focusDuration < 60){
      setFocusDuration((currentDuration) => currentDuration + 5)
    }
  }

  // create handler for Decrease button for Focus
  const decreaseFocusButtonHandler = (event) => {
    event.preventDefault();
    if (focusDuration > 5){
      setFocusDuration((currentDuration) => currentDuration - 5)
    }
  }

 //create handler for Increase button for Break
  const increaseBreakButtonHandler = (event) => {
    event.preventDefault();
    if (breakDuration < 15){
      setBreakDuration((currentDuration) => currentDuration + 1)
    }
  }


 // create handler for Decrease button for Break
  const decreaseBreakButtonHandler = (event) => {
    event.preventDefault();
    if (breakDuration > 1){
     setBreakDuration((currentDuration) => currentDuration - 1)
    }
 }

 //create handler for Stop Button 
const stopButtonHandler = (event) => {
  event.preventDefault();
  setIsTimerRunning(false);
  setFocusDuration(25);
  setBreakDuration(5);
  setAriaValue(0);
  setSession(null);
}




  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <FocusTimer 
            focusDuration={focusDuration}
            minutesToDuration={minutesToDuration}
            isTimerRunning={isTimerRunning}
            increaseFocusButtonHandler={increaseFocusButtonHandler}
            decreaseFocusButtonHandler={decreaseFocusButtonHandler}
          />
        </div>
        <div className="col">
          <div className="float-right">
            <BreakTimer 
            breakDuration={breakDuration}
            minutesToDuration={minutesToDuration}
            isTimerRunning={isTimerRunning}
            increaseBreakButtonHandler={increaseBreakButtonHandler}
            decreaseBreakButtonHandler={decreaseBreakButtonHandler}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              disabled = {!isTimerRunning}
              onClick={stopButtonHandler}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      {(session!=null) ?
          <div>
            {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
            <div className="row mb-2">
              <div className="col">
                {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
                <h2 data-testid="session-title">
                  {session?.label} for {minutesToDuration(session?.duration)} minutes
                </h2>
                {/* TODO: Update message below correctly format the time remaining in the current session */}
                <p className="lead" data-testid="session-sub-title">
                  {secondsToDuration(session?.timeRemaining)} remaining
                </p>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">
                {isTimerRunning ? <p></p> : <p style={{fontSize: "35px"}}>PAUSED</p>}
                <ProgressBar 
                ariaValue={ariaValue}
                />
              </div>
            </div>
          </div>
      : <p></p>}
    </div>
  );
}

export default Pomodoro;