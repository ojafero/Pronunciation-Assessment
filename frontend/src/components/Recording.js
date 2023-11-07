import React from "react";
import "./Recording.css";

function Recording({ isVisible }) {
  return (
    <div className={`recording ${!isVisible && "recording--hidden"}`}>
      <div className="recording__icon"></div>
      <div>Recording</div>
    </div>
  );
}

export default Recording;
