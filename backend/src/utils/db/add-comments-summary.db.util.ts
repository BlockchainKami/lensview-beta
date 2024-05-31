import { CommentsSummaryResponseModel } from "../../models/response/comments-summary.response.model";
import { InternalServerError } from "../../errors/internal-server-error.error";
import Publication from "../../models/db/publication.db.model";
import { logger } from "../../log/log-manager.log";
import { httpStatusCodes } from "../../config/app-constants.config";

export const addCommentsSummaryDbUtil = async (
  publicationId: string,
  summary: CommentsSummaryResponseModel,
  commentCount: number
) => {
  logger.info(
    "add-comments-summary.db.util.ts: addCommentsSummaryDbUtil: Execution Started."
  );
  try {
    const newPublication = new Publication({
      id: publicationId,
      summary: summary.summary,
      sentiment: summary.sentiment.toUpperCase(),
      commentCount: commentCount
    });
    await newPublication.save();
    logger.info(
      "add-comments-summary.db.util.ts: addCommentsSummaryDbUtil: Execution End. Summary added successfully."
    );
    return;
  } catch (error) {
    logger.error(
      "add-comments-summary.db.util.ts: addCommentsSummaryDbUtil: Failed to add summary. Error: " +
        error
    );
    throw new InternalServerError(
      "Error while adding summary",
      httpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
