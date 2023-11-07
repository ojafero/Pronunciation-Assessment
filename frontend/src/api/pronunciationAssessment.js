import {
  ResultReason,
  CancellationReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { getTokenOrRefresh } from "./token_util";
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

async function assessPronunciation(audioFile, referenceText) {
  let results = null;
  let error = null;

  const tokenObj = await getTokenOrRefresh();
  if (!tokenObj || tokenObj.error) {
    return ["Unable to get token", results];
  }

  const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
    tokenObj.authToken,
    tokenObj.region
  );
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
  const speechRecognizer = new speechsdk.SpeechRecognizer(
    speechConfig,
    audioConfig
  );

  const pronunciationAssessmentConfig =
    new speechsdk.PronunciationAssessmentConfig(
      referenceText,
      speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
      speechsdk.PronunciationAssessmentGranularity.Word,
      true
    );

  pronunciationAssessmentConfig.applyTo(speechRecognizer);
  const result = await fetchResults(speechRecognizer);
  // eslint-disable-next-line default-case
  switch (result.reason) {
    case ResultReason.RecognizedSpeech:
      const pronunciationAssessmentResult =
        speechsdk.PronunciationAssessmentResult.fromResult(result);
      results = pronunciationAssessmentResult;

      break;
    case ResultReason.NoMatch:
      console.log("NOMATCH: Speech could not be recognized.");
      error = " Speech could not be recognized.";
      break;
    case ResultReason.Canceled:
      const cancellation = speechsdk.CancellationDetails.fromResult(result);
      console.log(`CANCELED: Reason=${cancellation.reason}`);
      error = "Pronunciation failed";
      if (cancellation.reason === CancellationReason.Error) {
        console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
        error = `CANCELED: ErrorCode=${cancellation.ErrorCode} ErrorDetails=${cancellation.errorDetails}`;
      }
      break;
  }

  return [error, results];
}

async function fetchResults(speechRecognizer) {
  return new Promise(function (resolve, reject) {
    speechRecognizer.recognizeOnceAsync(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export default assessPronunciation;
