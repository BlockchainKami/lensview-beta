const extractTwitterIDFromLastLink = (content: string) => {
  console.log("content : " + content);
  const pattern = /https:\/\/(?:twitter|x)\.com\/\w+\/status\/(\d+)/g;
  const matches = [...content.matchAll(pattern)];

  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    return lastMatch[1];
  }

  return null;
};

const getLinkPreviewHtmlHelperUtil = (content: string) => {
  const twitterID = extractTwitterIDFromLastLink(content);
  if (twitterID) {
    console.log("Extracted ID from the last link:", twitterID);
    return twitterID;
  } else {
    console.log("No Twitter URLs found.");
    return ``;
  }
};

export default getLinkPreviewHtmlHelperUtil;
