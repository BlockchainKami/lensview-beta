import { preprocessURLUtil } from "../preprocess-url.util";
import { createHashUtil } from "../create-hash.util";
import { getRelatedParentPublicationsUtil } from "../related-parent-publications.util";
import { SUCCESS } from "../../config/app-constants.config";

/**
 * Retrieves the publications related to a given URL.
 *
 * @param {string} URL - The URL for which to retrieve related publications.
 * @return {Promise<{relatedPublications: string[], message: string}>} - The related publications and a success message.
 */
export const getPublicationsForUrlPublicationsUtil = async (URL: string) => {
  let relatedPublications: Array<string> = [];
  const urlObject = preprocessURLUtil(URL);
  const hostname = urlObject?.[1];
  if (hostname) {
    const tag = createHashUtil(hostname.toString());

    const relatedPosts = await getRelatedParentPublicationsUtil(tag);

    if (relatedPosts["items"].length < 1) {
      relatedPublications = [];
    } else {
      for (let i = 0; i < relatedPosts["items"].length; i++) {
        relatedPublications.push(relatedPosts["items"][i]["id"]);
      }
    }
  } else {
    throw new Error();
  }
  return {
    relatedPublications,
    message: SUCCESS
  };
};
