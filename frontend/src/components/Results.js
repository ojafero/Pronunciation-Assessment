import React, { forwardRef } from "react";
import { Tooltip, Typography, Progress } from "antd";
import { Empty } from "antd";
import { Divider } from "antd";
import "./Results.css";

const { Text, Paragraph } = Typography;

const types = {
  Omission: "secondary",
  Insertion: "warning",
  Mispronunciation: "danger",
  None: "",
};

function renderWord(word) {
  const errorType = word.PronunciationAssessment.ErrorType;
  const type = types[errorType];

  if (errorType === "Omission" || errorType === "Insertion") {
    return (
      <Text type={type} className="words__word">
        {word.Word}
      </Text>
    );
  } else {
    return (
      <Tooltip
        title={`Accuracy: ${word.PronunciationAssessment.AccuracyScore}%`}
        color="blue"
      >
        <Text underline type={type} className="words__word">
          {word.Word}
        </Text>
      </Tooltip>
    );
  }
}

const Results = forwardRef(function ({ results }, ref) {
  if (!results) {
    return (
      <div className="results">
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 60 }}
          description={<span>An error occured. Please try again</span>}
        ></Empty>
      </div>
    );
  }

  const words = results.privPronJson.Words;
  const wordElements = words.map((word) => renderWord(word));

  return (
    <div className="results">
      <Divider>Results</Divider>
      <div className="progress__container">
        <Progress
          type="circle"
          percent={results.privPronJson.PronunciationAssessment.AccuracyScore}
          format={(percent) => `Accuracy ${percent}%`}
          size={80}
          className="progress__circle"
        />
      </div>
      <div className="results__legend">
        <Paragraph>
          {
            "What the colors represent: Orange = Inserted, Red = Mispronounced, Grey = Omitted "
          }
        </Paragraph>
      </div>
      <div className="results__words" ref={ref}>
        {wordElements}
      </div>
    </div>
  );
});

export default Results;
