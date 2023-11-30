import { Request, Response } from "express";
import { isInputTypeURLUtil } from "../utils/helpers/is-input-url.helpers.util";
import { httpStatusCodes } from "../config/app-constants.config";
import { getRelatedPublicationsService } from "../services/lens/related-parent-publications.lens.service";
import postOnChainPublicationUtil from "../utils/publications/post-onchain.publication.util";
import { preprocessURLAndCreateMetadataObject } from "../utils/helpers/preprocess-url-and-create-metadata-object.helpers.util";

/**
 * Adds a URL or a post comment to the system.
 *
 * @param {Request} req - The request object containing user input.
 * @param {Response} res - The response object to send back to the client.
 * @return {Promise<void>} A Promise that resolves when the URL or post comment is successfully added.
 */
export const addUrlOrPostCommentController = async (req: Request, res: Response) => {
  try {
    const {
      userEnteredString,
      postContent,
      lensHandle,
      userTags: tags
    } = req.body;

    const urlString = isInputTypeURLUtil(userEnteredString);
    if (!urlString) {
      return res.status(httpStatusCodes.BAD_REQUEST).send({
        isURL: false,
        message: "User entered a tag"
      });
    }

    const urlObj = preprocessURLAndCreateMetadataObject(urlString, lensHandle, postContent, tags)
    const publicationExists = await getRelatedPublicationsService([urlObj.hashedURL]);

    if (publicationExists && publicationExists.items.length > 0) {
      console.log(JSON.stringify(publicationExists));
      return res.status(httpStatusCodes.OK).send({
        message: "Publication Found"
      });
    } else {
      const trxHash = await postOnChainPublicationUtil(urlObj);
      res.status(200).send({
        url: urlObj.url,
        tags,
        trxHash
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to ADD URL OR POST COMMENT to LensView"
    });
  }
};
