import Queue from "bull";
import { InternalServerError } from "../../errors/internal-server-error.error";
import { uploadScreenshotAndCommentWithImageJobUtil } from "./upload-screenshot-and-comment-with-image.job.util";

/**
 * Adds an image to a publication.
 *
 * @param {Queue.Job<any>} job - The job containing the data needed to add the image.
 * @return {Promise<void>} - A promise that resolves when the image has been added successfully.
 */
export const addImageToPublicationJobUtil = async (job: Queue.Job<any>) => {
  try {
    const { urlObj } = job.data;
    await uploadScreenshotAndCommentWithImageJobUtil(urlObj);
    return;
  } catch (error) {
    console.log(error);
    throw new InternalServerError(
      "Error while adding image to publication: " + error,
      500,
      "Internal Server Error",
      false
    );
  }
};
