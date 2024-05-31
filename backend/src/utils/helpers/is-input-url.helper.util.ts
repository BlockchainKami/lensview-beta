import { URL } from "url";
import { logger } from "../../log/log-manager.log";

/**
 * Checks if the input string is a valid URL.
 *
 * @param url - The input string to be checked.
 * @returns The input string if it is a valid URL, otherwise null.
 */
export const isInputTypeURLHelperUtil = (url: string) => {
  logger.info(
    "is-input-url.helper.util.ts: isInputTypeURLHelperUtil: Execution Started"
  );
  logger.info(
    "is-input-url.helper.util.ts: isInputTypeURLHelperUtil: Function Input Parameters: " +
      url
  );
  let urlRequest = url;
  try {
    // remove whitespaces and the fragment(#) part of the URL
    // url = url.trim().split("#")[0];
    // remove www from the url
    urlRequest = stripWww(url);
    // remove whitespaces from the start and end of the string
    urlRequest = urlRequest.trim();
    // check if there is at least one dot in the string, string does not start with a dot and there are no spaces in between
    // new URL(string) returns a valid url even if there are spaces between the letters after hostname.
    if (urlRequest.indexOf(".") <= 0 || urlRequest.indexOf(" ") > 0) {
      return null;
    }
    // append https:// to the string if the string does not contain protocol
    if (
      urlRequest.substring(0, 8) != "https://" &&
      urlRequest.substring(0, 7) != "http://"
    ) {
      urlRequest = "https://" + urlRequest;
    }
    // make the string a URL object if possible, otherwise throw an error
    new URL(urlRequest);
    logger.info(
      "is-input-url.helper.util.ts: isInputTypeURLHelperUtil: Input Type is URL. urlRequest object: " +
        JSON.stringify(urlRequest)
    );
  } catch (error) {
    logger.info(
      "is-input-url.helper.util.ts: isInputTypeURLHelperUtil: Input Type is not URL. error: " +
        error
    );
    // return null if error was thrown
    return null;
  }
  logger.info(
    "is-input-url.helper.util.ts: isInputTypeURLHelperUtil: Execution Completed"
  );
  return urlRequest;
};

/**
 * Strips the "www" subdomain from a URL string.
 *
 * @param {string} s - The URL string to be processed.
 * @return {string} The URL string with the "www" subdomain removed.
 */
const stripWww = (s: string) => {
  const regExp = /^(https?:\/\/)?(www\.)?(.*)/;
  const regExpArr = regExp.exec(s);
  if (!regExpArr) return s;
  return `${regExpArr[1] ?? ""}${regExpArr[3]}`;
};
