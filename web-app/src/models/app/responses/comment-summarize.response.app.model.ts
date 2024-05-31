import type { summarySentiment } from "../../../config/app-constants.config";

export interface CommentSummarizeResponseAppModel {
  summary: string;
  sentiment: summarySentiment;
  lastUpdatedAt: string;
}
