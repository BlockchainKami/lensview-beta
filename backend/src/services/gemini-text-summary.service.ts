import { GoogleGenerativeAI } from "@google/generative-ai";

import { InternalServerError } from "../errors/internal-server-error.error";
import { GEMINI_API_KEY } from "../config/env.config";
import { logger } from "../log/log-manager.log";
import { generationConfig, safetySettings } from "../config/gen-ai.config";
import { summarySentiment } from "../config/app-constants.config";

export const geminiTextSummaryService = async (text: string) => {
  logger.info(
    "gemini-text-summary.service.ts: geminiTextSummartService: Execution Started."
  );
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const summaryPrompt =
      "Summarize the following comments of users in 2-3 sentences. The comments are in the descending order of number of likes," +
      "so higher weightage should be given to first comment. Also do not use usernames and try not to repeat the comments. Instead" +
      "provide a summary of all the comments as a whole, with slightly higher weightage for the comments with more likes" +
      "Here are the comments-" +
      text;

    const chat = model.startChat({ safetySettings, generationConfig });
    const summaryResponse = await chat.sendMessage(summaryPrompt);
    const summaryResult = summaryResponse.response;
    const summary = summaryResult.text();

    const sentimentResponse = await chat.sendMessage(
      "Classify the sentiment of the response as either positive, negative, or neutral, in one word only."
    );
    const sentimentResult = sentimentResponse.response;
    const sentiment = sentimentResult.text();

    // const summaryResponse = await model.generateContent(summaryPrompt);
    // const summaryResult = summaryResponse.response;
    // const summary = summaryResult.text();

    // const sentimentPrompt =
    //   "Classify the sentiment of the following paragraph as positive, negative, or neutral-" +
    //   summary;
    //
    // const sentimentResponse = await model.generateContent(sentimentPrompt);
    // const sentimentResult = sentimentResponse.response;
    // const sentiment = sentimentResult.text();

    const responseObject = {
      summary: summary,
      sentiment: translateSummarySentiment(sentiment.toUpperCase()),
      lastUpdatedAt: new Date()
    };
    logger.info(
      "gemini-text-summary.service.ts: geminiTextSummartService: Execution Completed. Response Object: " +
        responseObject
    );
    return responseObject;
  } catch (error) {
    logger.error(
      "gemini-text-summary.service.ts: geminiTextSummartService: Error in execution. " +
        error
    );
    throw new InternalServerError("Could not Fetch Summary From Gemini", 500);
  }
};

const translateSummarySentiment = (sentiment: string) => {
  if (sentiment == summarySentiment.POSITIVE) {
    return summarySentiment.POSITIVE;
  } else if (sentiment == summarySentiment.NEGATIVE) {
    return summarySentiment.NEGATIVE;
  } else {
    return summarySentiment.NEUTRAL;
  }
};
