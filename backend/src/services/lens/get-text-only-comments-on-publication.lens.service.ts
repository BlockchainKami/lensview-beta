import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationReactionType,
  PublicationsRequest,
  PublicationStatsReactionArgs,
  PublicationsWhere
} from "../../gql/graphql";
import { InternalServerError } from "../../errors/internal-server-error.error";
import getBaseClientHelperUtil from "../../utils/helpers/get-base-client.helper.util";
import { httpStatusCodes } from "../../config/app-constants.config";
import { logger } from "../../log/log-manager.log";
import getTextOnlyCommentsOnPublicationQueryGraphql from "../../graphql/queries/get-text-only-comments-on-publication.query.graphql";
import { GetTextOnlyCommentsLensModel } from "../../models/lens/get-text-only-comments.lens.model";

export const getTextOnlyCommentsOnPublicationLensService = async (
  pubId: string
) => {
  try {
    logger.info(
      "get-text-only-comments-on-publication.lens.service.ts: getTextOnlyCommentsOnPublicationLensService: Execution Started."
    );
    const publicationsWhere: PublicationsWhere = {
      commentOn: {
        id: pubId
      },
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.TextOnly],
        tags: {
          oneOf: ["1c5e2a7f174e40885e5be99baf6608a0965995ce"]
        },
        publishedOn: ["LensView"]
      }
    };

    const publicationsRequest: PublicationsRequest = {
      limit: LimitType.Fifty,
      where: publicationsWhere
    };

    const publicationStatsReactionArgs: PublicationStatsReactionArgs = {
      type: PublicationReactionType.Upvote
    };

    logger.info(
      "get-text-only-comments-on-publication.lens.service.ts: getTextOnlyCommentsOnPublicationLensService: publicationsRequest: " +
        JSON.stringify(publicationsRequest)
    );

    const result = await getBaseClientHelperUtil
      .query(getTextOnlyCommentsOnPublicationQueryGraphql, {
        request: publicationsRequest,
        reactionsRequest2: publicationStatsReactionArgs
      })
      .toPromise();

    const comments = result?.data?.publications as GetTextOnlyCommentsLensModel;
    logger.info(
      "get-text-only-comments-on-publication.lens.service.ts: getTextOnlyCommentsOnPublicationLensService: Comments Fetched Successfully. Execution End."
    );
    return comments;
  } catch (error) {
    logger.error(
      "get-text-only-comments-on-publication.lens.service.ts: getTextOnlyCommentsOnPublicationLensService: error: " +
        error
    );
    throw new InternalServerError(
      "Error in Execution " + error,
      httpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
