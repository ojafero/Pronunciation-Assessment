const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

const port = process.env.PORT || "3001";

app.get("/api/get-speech-token", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;
  const headers = {
    headers: {
      "Ocp-Apim-Subscription-Key": speechKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const tokenResponse = await axios.post(
      `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      headers
    );
    res.send({ token: tokenResponse.data, region: speechRegion });
  } catch (err) {
    res.status(401).send("There was an error authorizing your speech key.");
  }
});

app.listen(port, () =>
  console.log(`Express server is running on localhost:${port}`)
);
