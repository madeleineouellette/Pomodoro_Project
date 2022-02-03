import React from "react";

function FocusTimer({increaseFocusButtonHandler, decreaseFocusButtonHandler, focusDuration, minutesToDuration, isTimerRunning }){

    return (
    <div className="input-group input-group-lg mb-2">
    <span className="input-group-text" data-testid="duration-focus">
      {/* TODO: Update this text to display the current focus session duration */}
      Focus Duration: {minutesToDuration(focusDuration)}
    </span>
    <div className="input-group-append">
      {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
      <button
        type="button"
        className="btn btn-secondary"
        data-testid="decrease-focus"
        disabled = {isTimerRunning}
        onClick={decreaseFocusButtonHandler}
      >
        <span className="oi oi-minus" />
      </button>
      {/* TODO: Implement increasing focus duration and disable during a focus or break session */}
      <button
        type="button"
        className="btn btn-secondary"
        data-testid="increase-focus"
        disabled = {isTimerRunning}
        onClick={increaseFocusButtonHandler}
      >
        <span className="oi oi-plus" />
      </button>
    </div>
  </div>)

}



export default FocusTimer;