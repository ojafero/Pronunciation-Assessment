import React, { useState, useRef, useEffect } from "react";
import { Typography, Tour, Button, message, Spin } from "antd";
import Passage from "./components/Passage";
import "./App.css";
import Recorder from "./components/Recorder";
import Results from "./components/Results";
import sampleResponse, { sampleReferenceText } from "./api/sampleResponse.js";
import assessPronunciation from "./api/pronunciationAssessment";
const { Title } = Typography;

function App() {
  const [passage, setPassage] = useState(sampleReferenceText);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(sampleResponse);
  const [open, setOpen] = useState(false);
  const refPassage = useRef(null);
  const refRecordButtons = useRef(null);
  const refResults = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const steps = [
    {
      title: "Reading Text",
      description:
        "Please type in the text that you would like to use for testing your pronunciation here.",
      target: () => refPassage.current,
    },
    {
      title: "Record",
      description:
        "Click on the record button and start reading the text. Please remember to keep your recording duration under 15 seconds.",
      target: () => refRecordButtons.current,
    },
    {
      title: "End Recording",
      description:
        "After you have finished reading the text, please click on the stop button. We will then proceed to calculate your score.",
      target: () => refRecordButtons.current,
    },
    {
      title: "Results",
      description:
        "Hover over a word to check how accurately you pronounced that word.",
      target: () => refResults.current,
    },
  ];

  async function analyzeRecording(file) {
    if (!file) {
      messageApi.open({
        type: "error",
        content: "An error occured while recording. Please record again.",
      });
      setIsLoading(false);
      setResults(null);
      return;
    } else if (passage.trim().length === 0) {
      messageApi.open({
        type: "error",
        content: "Please enter text in the text field before start recording.",
      });
      setIsLoading(false);
      setResults(null);
      return;
    }

    const [error, result] = await assessPronunciation(file, passage);

    if (error) {
      messageApi.open({
        type: "error",
        content:
          "An error occured while assessing pronunciation. Please record again.",
      });
      setResults(null);
    } else {
      setResults(result);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true });
  }, []);

  return (
    <div className="app">
      {contextHolder}
      <div className="app__page">
        <Title>Assess Your Pronunciation</Title>
        <Button type="primary" onClick={() => setOpen(true)}>
          Begin Tour
        </Button>

        <div className="app__user-input">
          <Passage ref={refPassage} passage={passage} setPassage={setPassage} />
          <Recorder
            ref={refRecordButtons}
            setIsLoading={setIsLoading}
            setFile={analyzeRecording}
          />
        </div>
        {isLoading ? (
          <Spin className="app__loading" />
        ) : (
          <Results results={results} ref={refResults} />
        )}
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
      </div>
    </div>
  );
}

export default App;
