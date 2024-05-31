import axios from "axios";
import { AYFIE_API_KEY } from "../config/env.config";
export const ayfieTextSummaryService = async (text: string) => {
  const data = JSON.stringify({
    language: "auto",
    text: text,
    min_length: 5,
    max_length: 50
  });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://portal.ayfie.com/api/summarize",
    headers: {
      "X-API-Key": AYFIE_API_KEY,
      "Content-Type": "application/json"
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
