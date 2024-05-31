import { InternalServerError } from "../../errors/internal-server-error.error";
import Publication from "../../models/db/publication.db.model";
import { httpStatusCodes } from "../../config/app-constants.config";
import { logger } from "../../log/log-manager.log";

export const getPublicationDbUtil = async (publicationId: string) => {
  try {
    return await Publication.findOne({ id: publicationId });
  } catch (error) {
    logger.error(
      "get-publication.db.util.ts: getPublicationDbUtil: Failed to get publication. Error: " +
        error
    );
    throw new InternalServerError(
      "Error while getting publication",
      httpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
