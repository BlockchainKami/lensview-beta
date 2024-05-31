import fs from "fs";
import { Blob, NFTStorage } from "nft.storage";
import { MetadataObjectModel } from "../../models/metadata-object.model";
import { makeGatewayURLImage } from "../jobs/fetch-screenshot-and-upload-to-ipfs.job.util";
import { createMetaDataForImageCommentHelperUtil } from "./create-metadata.helper.util";
import { NFT_STORAGE_TOKEN } from "../../config/env.config";
import { logger } from "../../log/log-manager.log";

export const uploadImageFromDisk = async (
  filename: string,
  urlObj: MetadataObjectModel
) => {
  logger.info(
    "upload-image-from-disk.helper.util.ts: uploadImageFromDisk: Execution Started"
  );
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const image = fs.readFileSync(__dirname + "/" + filename + ".png");
  const screenshotBlob = new Blob([image]);
  const imgCID = await client.storeBlob(screenshotBlob);
  urlObj.image = makeGatewayURLImage(imgCID);
  logger.info(
    "upload-image-from-disk.helper.util.ts: uploadImageFromDisk: Execution Ended. Image Stored at: " +
      makeGatewayURLImage(imgCID)
  );
  return createMetaDataForImageCommentHelperUtil(urlObj);
};
