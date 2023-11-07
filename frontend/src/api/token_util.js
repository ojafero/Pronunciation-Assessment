import axios from "axios";
import Cookie from "universal-cookie";

export async function getTokenOrRefresh() {
  const cookie = new Cookie();
  const speechToken = cookie.get("speech-token");

  if (speechToken === undefined) {
    try {
      const res = await axios.get("http://localhost:3001/api/get-speech-token");
      const token = res.data.token;
      const region = res.data.region;

      cookie.set("speech-token", region + ":" + token, {
        maxAge: 540,
        path: "/",
      });

      return { authToken: token, region: region };
    } catch (err) {
      return { authToken: null, error: err };
    }
  } else {
    const idx = speechToken.indexOf(":");
    return {
      authToken: speechToken.slice(idx + 1),
      region: speechToken.slice(0, idx),
    };
  }
}
