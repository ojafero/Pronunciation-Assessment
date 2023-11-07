import React, { useState, forwardRef } from "react";
import { WavRecorder } from "webm-to-wav-converter";
import { Button } from "antd";
import Recording from "./Recording";
import { message } from "antd";

import "./Recorder.css";

const wavRecorder = new WavRecorder();

const Recorder = forwardRef(function ({ setFile, setIsLoading }, ref) {
  const [isRecording, setIsRecording] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  function startRecording() {
    wavRecorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    wavRecorder.stop();
    setIsRecording(false);
    setIsLoading(true);
    setTimeout(() => {
      wavRecorder
        .getBlob()
        .then((blob) => {
          if (!blob) {
            throw new Error("Blob empty");
          }

          const file = new File([blob], "audio.wav");
          setFile(file);
        })
        .catch((e) => {
          console.error(e);
          showError();
          setFile(null);
        });
    });
  }

  function showError() {
    messageApi.open({
      type: "error",
      content: "An error occured while recording. Please record again.",
    });
  }

  return (
    <div className="recorder" ref={ref}>
      {contextHolder}
      <div className="recorder__button-group">
        <Button onClick={startRecording}>Start New Recording</Button>
        <Button onClick={stopRecording} disabled={!isRecording}>
          Stop
        </Button>
      </div>
      <Recording isVisible={isRecording} />
    </div>
  );
});

export default Recorder;
