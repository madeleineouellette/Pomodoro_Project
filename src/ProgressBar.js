import React from "react";

function ProgressBar({ariaValue}) {
    return (

        <div className="progress" style={{ height: "20px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={ariaValue} // TODO: Increase aria-valuenow as elapsed time increases
                    style={{ width: `${ariaValue}%` }} // TODO: Increase width % as elapsed time increases
                  />
                </div>
    )
}


export default ProgressBar