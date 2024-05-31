import { GetTextOnlyCommentsLensModel } from "../../models/lens/get-text-only-comments.lens.model";
import { logger } from "../../log/log-manager.log";

export const formatTextOnlyInputDataHelperUtil = (
  texOnlyComments: GetTextOnlyCommentsLensModel
) => {
  logger.info(
    "format-text-only-input-data.helper.util.ts: formatTextOnlyInputDataHelperUtil: Execution Started."
  );
  const rankWiseComments = sortComments(texOnlyComments.items);
  const commentString = getCommentsFromObject(rankWiseComments);
  logger.info(
    "format-text-only-input-data.helper.util.ts: formatTextOnlyInputDataHelperUtil: Execution Ended."
  );
  return commentString;
};

const sortComments = (comments: GetTextOnlyCommentsLensModel["items"]) => {
  logger.info(
    "format-text-only-input-data.helper.util.ts: sortComments: Sorting comments based on upvote."
  );
  return comments.sort((a, b) => b.stats.upvotes - a.stats.upvotes);
};

const getCommentsFromObject = (
  comments: GetTextOnlyCommentsLensModel["items"]
) => {
  logger.info(
    "format-text-only-input-data.helper.util.ts: getCommentsFromObject: Creating input string."
  );
  let inputString = ``;
  comments.forEach((comment, index) => {
    const userComment = removeTags(comment.metadata.content);
    inputString += "user" + index + ": " + userComment + ".\n ";
  });
  return inputString;
};

const removeTags = (str: string) => {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/gi, "");
};
