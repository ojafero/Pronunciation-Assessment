import React, { forwardRef } from "react";
import { Input } from "antd";
import "./Passage.css";

const { TextArea } = Input;

const Passage = forwardRef(({ passage, setPassage }, ref) => {
  return (
    <div className="passage" ref={ref}>
      <TextArea
        className="passage__input"
        style={{ resize: "none" }}
        showCount
        maxLength={100}
        placeholder="Enter Reading Text Here"
        value={passage}
        onChange={(e) => setPassage(e.target.value)}
      />
    </div>
  );
});

export default Passage;
