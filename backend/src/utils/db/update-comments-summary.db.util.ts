import { CommentsSummaryResponseModel } from "../../models/response/comments-summary.response.model";
import { InternalServerError } from "../../errors/internal-server-error.error";
import Publication from "../../models/db/publication.db.model";
import { logger } from "../../log/log-manager.log";
import { httpStatusCodes } from "../../config/app-constants.config";

export const updateCommentsSummaryDbUtil = async (
  publicationId: string,
  summary: CommentsSummaryResponseModel,
  newCommentCount: number
) => {
  logger.info(
    "update-comments-summary.db.util.ts: updateCommentsSummaryDbUtil: Execution Started."
  );
  try {
    const publicationToUpdate = await Publication.findOne({
      id: publicationId
    });
    if (publicationToUpdate) {
      logger.info(
        "update-comments-summary.db.util.ts: updateCommentsSummaryDbUtil: Publication found in DB. Updating summary."
      );
      publicationToUpdate.summary = summary.summary;
      publicationToUpdate.sentiment = summary.sentiment.toUpperCase();
      publicationToUpdate.commentCount = newCommentCount;
      await publicationToUpdate.save();
    }
    logger.info(
      "update-comments-summary.db.util.ts: updateCommentsSummaryDbUtil: Execution End. Summary updated successfully."
    );
    return;
  } catch (error) {
    logger.error(
      "update-comments-summary.db.util.ts: updateCommentsSummaryDbUtil: Failed to update summary. Error: " +
        error
    );
    throw new InternalServerError(
      "Error while updating summary",
      httpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
