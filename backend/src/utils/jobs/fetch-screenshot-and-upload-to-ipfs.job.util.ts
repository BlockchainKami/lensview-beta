import puppeteer from "puppeteer";
import { NFT_STORAGE_TOKEN } from "../../config/env.config";
import { NFTStorage, Blob, CIDString } from "nft.storage";
import { minimal_args } from "../../config/puppetteer.config";
import { InternalServerError } from "../../errors/internal-server-error.error";
// import { CIDString, Web3Storage, File } from "web3.storage";
// import { Blob } from "buffer";

/**
 * Fetches a screenshot from the given URL and uploads it to IPFS.
 *
 * @param {string} url - The URL of the website to take a screenshot of.
 * @return {Promise<string>} - A promise that resolves to the URL of the uploaded image on IPFS.
 */
export const fetchScreenshotAndUploadToIPFSJobUtil = async (url: string) => {
  // const imgName = "image.jpg";
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  try {
    const screenshot = await Screenshot(url);
    console.log("Screenshot taken successfully");
    const screenshotBlob = new Blob([screenshot]);
    // const file = new File([screenshotBlob as BlobPart], imgName);
    // const client = new Web3Storage({ token: WEB3STORAGE_TOKEN });
    // const imgCID = await client.put([file], { name: imgName });
    const imgCID = await client.storeBlob(screenshotBlob);
    console.log("Screenshot image stored: " + makeGatewayURLImage(imgCID));
    return makeGatewayURLImage(imgCID);
  } catch (error) {
    throw new InternalServerError(
      "Error while uploading screenshot to IPFS: " + error,
      500,
      "Internal Server Error",
      false
    );
  }
};

/**
 * Generates a gateway URL for an image based on the image CID and image name.
 *
 * @param {CIDString} imgCID - The CID of the image.
 * @return {string} The generated gateway URL for the image.
 */
const makeGatewayURLImage = (imgCID: CIDString) => {
  return `https://${imgCID}.ipfs.nftstorage.link`;
};

/**
 * Takes a screenshot of a webpage given its URL.
 *
 * @param {string} url - The URL of the webpage to take a screenshot of.
 * @return {Promise<Buffer>} A Promise that resolves to the screenshot image as a Buffer.
 * @throws {InternalServerError} If there is an error while taking the screenshot.
 */
const Screenshot = async (url: string) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: minimal_args
    });
    const page = await browser.newPage();

    /** Disable Unnecessary Resources **/
    const blocked_domains = ["googlesyndication.com", "adservice.google.com"];
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (blocked_domains.some((domain) => url.includes(domain))) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.setViewport({ width: 1400, height: 3000 });
    await page.waitForTimeout(3000);
    const screenshot = await page.screenshot({ type: "jpeg" });
    await page.close();
    await browser.close();
    return screenshot;
  } catch (error) {
    throw new InternalServerError(
      "Error while taking screenshot",
      500,
      "Internal Server Error",
      false
    );
  }
};
