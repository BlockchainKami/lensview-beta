import { Request, Response } from "express";

import { putAnonymousCommentBodyRequestModel } from "../models/requests/body/put-anonymous-comment.body.request.model";
import {
  PublicationResponseModel,
  PublicationResponseModelForPostAnonymousComment
} from "../models/response/publication.response.model";
import PostAnonymousCommentRequestBodyModel from "../models/requests/body/post-anonymous-comment.body.request.model";
import { CommentsSummaryResponseModel } from "../models/response/comments-summary.response.model";
import {
  createMetaDataForAnonymousCommentHelperUtil,
  createMetaDataForUrlHelperUtil
} from "../utils/helpers/create-metadata.helper.util";
import { isInputTypeURLHelperUtil } from "../utils/helpers/is-input-url.helper.util";
import { relatedParentPublicationsLensService } from "../services/lens/related-parent-publications.lens.service";
import { getMainPublicationImageLensService } from "../services/lens/get-main-publication-image.lens.service";
import { getCommentMethod, getPostMethod } from "../config/app-config.config";
import { preprocessURLAndCreateMetadataObjectHelperUtil } from "../utils/helpers/preprocess-url-and-create-metadata-object.helper.util";
import { addCommentsSummaryDbUtil } from "../utils/db/add-comments-summary.db.util";
import { getPublicationDbUtil } from "../utils/db/get-publication.db.util";
import { updateCommentsSummaryDbUtil } from "../utils/db/update-comments-summary.db.util";
import { getCommentsAndGenerateSummaryHelperUtil } from "../utils/helpers/get-comments-and-generate-summary.helper.util";
import { httpStatusCodes } from "../config/app-constants.config";
import { APP_LENS_HANDLE } from "../config/env.config";
import { imageQueue } from "../jobs/add-image-queue.job";
import { logger } from "../log/log-manager.log";
import { SummaryQueryRequestModel } from "../models/requests/query/summary.query.request.model";
import { isNewCommentAddedSinceLastUpdateHelperUtil } from "../utils/helpers/is-new-comment-added-since-last-update.helper.util";

/**
 * Adds a URL or a post comment to the system.
 *
 * @param {Request} req - The request object containing user input.
 * @param {Response} res - The response object to send back to the client.
 * @return {Promise<void>} A Promise that resolves when the URL or post comment is successfully added.
 */
export const postAnonymousCommentController = async (
  req: Request<unknown, unknown, PostAnonymousCommentRequestBodyModel>,
  res: Response<PublicationResponseModelForPostAnonymousComment>
) => {
  logger.info(
    "comments.controller.ts: postAnonymousCommentController: Execution Started"
  );
  try {
    const postOnLensView = getPostMethod();
    const commentOnLensView = getCommentMethod();
    const { url, content, userTags: tags } = req.body;
    const urlString = isInputTypeURLHelperUtil(url);
    if (!urlString) {
      logger.warn(
        "comments.controller.ts: postAnonymousCommentController: Execution End. User entered a tag: " +
          urlString
      );
      return res.status(httpStatusCodes.BAD_REQUEST).send({
        publicationID: null,
        alreadyExists: false,
        message: "User entered a tag"
      });
    }

    const urlObj = preprocessURLAndCreateMetadataObjectHelperUtil(
      urlString,
      APP_LENS_HANDLE,
      content,
      tags ? tags : []
    );
    const publicationExists = await relatedParentPublicationsLensService([
      urlObj.hashedURL
    ]);

    if (publicationExists && publicationExists.items.length > 0) {
      const publicationId = publicationExists.items[0]?.id;
      logger.info(
        "comments.controller.ts: postAnonymousCommentController: Publication already exists: Publication ID: " +
          publicationId
      );
      const mainPostImageUrl =
        await getMainPublicationImageLensService(publicationId);
      const commentMetadata = createMetaDataForAnonymousCommentHelperUtil(
        content,
        urlObj.url,
        mainPostImageUrl ? mainPostImageUrl : null,
        false
      );
      await commentOnLensView(publicationId, commentMetadata);
      logger.info(
        "comments.controller.ts: postAnonymousCommentController: Execution Ended. Publication Found and Anonymous Comment Added: Publication ID: " +
          publicationId
      );
      return res.status(httpStatusCodes.CREATED).send({
        publicationID: publicationId,
        alreadyExists: true,
        message: "Publication Found and Anonymous Comment Added"
      });
    } else {
      logger.info(
        "comments.controller.ts: postAnonymousCommentController: Publication Not Found. Adding URL to LensView."
      );
      const postMetadata = createMetaDataForUrlHelperUtil(urlObj);
      await postOnLensView(postMetadata);
      imageQueue.add({ urlObj });
      const addedPublication = await relatedParentPublicationsLensService([
        urlObj.hashedURL
      ]);
      if (addedPublication && addedPublication.items.length > 0) {
        const newPublicationId = addedPublication.items[0]?.id;
        logger.info(
          "comments.controller.ts: postAnonymousCommentController: Publication added and indexed on-chain: " +
            newPublicationId
        );
        // TODO: Can put a default image URL for mainPostImageUrl
        const commentMetadata = createMetaDataForAnonymousCommentHelperUtil(
          content,
          urlObj.url,
          "empty",
          false
        );
        await commentOnLensView(newPublicationId, commentMetadata);
        logger.info(
          "comments.controller.ts: postAnonymousCommentController: Execution Ended. Publication and Anonymous Comment Added: Publication ID: " +
            newPublicationId
        );
        return res.status(httpStatusCodes.CREATED).send({
          publicationID: addedPublication.items[0]?.id,
          alreadyExists: false,
          message: "Publication and Anonymous Comment Added"
        });
      } else {
        logger.error(
          "comments.controller.ts: postAnonymousCommentController: Server Timeout: Failed to add URL OR POST COMMENT to LensView"
        );
        return res.status(httpStatusCodes.SERVER_TIMEOUT).send({
          publicationID: null,
          alreadyExists: false,
          message: "Timeout while adding URL OR POST COMMENT to LensView"
        });
      }
    }
  } catch (e) {
    logger.error(
      "comments.controller.ts: postAnonymousCommentController: Error in Execution: Failed to add URL OR POST COMMENT to LensView"
    );
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      publicationID: null,
      alreadyExists: false,
      message: "Failed to ADD URL OR POST COMMENT to LensView"
    });
  }
};

/**
 * Handles the request to add an anonymous comment to a publication.
 *
 * @param {Request<unknown, unknown, putAnonymousCommentBodyRequestModel>} req - The request object containing the body with the publication ID and comment content.
 * @param {Response<putAnonymousCommentResponseModel>} res - The response object used to send the success message and status code.
 * @return {Promise<void>} - A promise that resolves when the comment has been successfully added.
 */
export const putAnonymousCommentController = async (
  req: Request<unknown, unknown, putAnonymousCommentBodyRequestModel>,
  res: Response<PublicationResponseModel>
) => {
  const commentOnLensView = getCommentMethod();
  try {
    logger.info(
      "comments.controller.ts: putAnonymousCommentController: Execution Started"
    );
    const { pubId, content, mainPostUrl, mainPostImageUrl, isThisComment } =
      req.body;
    const metadata = createMetaDataForAnonymousCommentHelperUtil(
      content,
      mainPostUrl,
      mainPostImageUrl,
      isThisComment
    );
    await commentOnLensView(pubId, metadata);
    logger.info(
      "comments.controller.ts: putAnonymousCommentController: Comment added to publication: " +
        pubId
    );
    logger.info(
      "comments.controller.ts: putAnonymousCommentController: Execution Ended"
    );
    res.status(httpStatusCodes.CREATED).send({
      publicationID: pubId,
      message: "Comment added successfully"
    });
  } catch (error) {
    logger.error(
      "comments.controller.ts: putAnonymousCommentController: Error in Execution: " +
        error
    );
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      publicationID: req.body.pubId,
      message: "Failed to ADD ANONYMOUS COMMENT to LensView"
    });
  }
};

export const getSummaryCommentController = async (
  req: Request<unknown, unknown, unknown, SummaryQueryRequestModel>,
  res: Response<CommentsSummaryResponseModel>
) => {
  try {
    logger.info(
      "comments.controller.ts: getSummaryCommentController: Execution Started."
    );
    const publicationId = req.query.pubId;
    const publicationData = await getPublicationDbUtil(publicationId);
    if (publicationData) {
      logger.info(
        "comments.controller.ts: getSummaryCommentController: Publication found in DB."
      );
      const isNewCommentAdded =
        await isNewCommentAddedSinceLastUpdateHelperUtil(
          publicationData.commentCount,
          publicationId
        );
      if (!isNewCommentAdded) {
        const response = {
          summary: publicationData.summary,
          sentiment: publicationData.sentiment,
          lastUpdatedAt: publicationData.updatedAt
        };
        logger.info(
          "comments.controller.ts: getSummaryCommentController: Execution End. No new comment added since last update. Summary: " +
            response.summary
        );
        res.status(httpStatusCodes.OK).send(response);
      } else {
        logger.info(
          "comments.controller.ts: getSummaryCommentController: Publication found in DB. New comment found in publication since last update. Updating summary."
        );
        const response =
          await getCommentsAndGenerateSummaryHelperUtil(publicationId);
        if (!response && response === null) {
          logger.info(
            "comments.controller.ts: getSummaryCommentController: Execution End "
          );
          res.status(httpStatusCodes.NO_CONTENT).send({
            summary: "Sorry! We failed to generate a summary for this thread",
            sentiment: "",
            lastUpdatedAt: null
          });
        } else {
          logger.info(
            "comments.controller.ts: getSummaryCommentController: Updating DB with updated summary."
          );
          await updateCommentsSummaryDbUtil(
            publicationId,
            response.summary,
            response.commentCount
          );
          logger.info(
            "comments.controller.ts: getSummaryCommentController: Execution Ended."
          );
          res.status(httpStatusCodes.OK).send(response.summary);
        }
      }
    } else {
      logger.info(
        "comments.controller.ts: getSummaryCommentController: Publication not found in DB. Adding summary."
      );
      const response =
        await getCommentsAndGenerateSummaryHelperUtil(publicationId);
      if (!response && response === null) {
        logger.info(
          "comments.controller.ts: getSummaryCommentController: Execution End "
        );
        res.status(httpStatusCodes.NO_CONTENT).send({
          summary: "Sorry! We failed to generate a summary for this thread",
          sentiment: "",
          lastUpdatedAt: null
        });
      } else {
        logger.info(
          "comments.controller.ts: getSummaryCommentController: Updating DB with summary."
        );
        await addCommentsSummaryDbUtil(
          publicationId,
          response.summary,
          response.commentCount
        );
        logger.info(
          "comments.controller.ts: getSummaryCommentController: Execution Ended."
        );
        res.status(httpStatusCodes.OK).send(response.summary);
      }
    }
  } catch (error) {
    logger.error(
      "comments.controller.ts: getSummaryCommentController: Error in Execution: " +
        error
    );
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      summary: "Sorry! We failed to generate a summary for this thread",
      sentiment: "",
      lastUpdatedAt: null
    });
  }
};
