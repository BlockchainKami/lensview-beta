import { Request, Response } from "express";
import {
  AddImageToPostAdminRouteBodyRequestModel,
  ApproveSignlessAdminRouteBodyRequestModel
} from "../models/requests/body/admin-route.body.request.model";
import { PublicationResponseModel } from "../models/response/publication.response.model";
import { RelayError, RelaySuccess } from "../gql/graphql";
import { InternalServerError } from "../errors/internal-server-error.error";
import LENS_HUB_ABI from "../abis/lens-hub-contract.abi.json";
import { relatedParentPublicationsLensService } from "../services/lens/related-parent-publications.lens.service";
import { uploadScreenshotAndCommentWithImageJobUtil } from "../utils/jobs/upload-screenshot-and-comment-with-image.job.util";
import { isInputTypeURLHelperUtil } from "../utils/helpers/is-input-url.helper.util";
import { preprocessURLAndCreateMetadataObjectHelperUtil } from "../utils/helpers/preprocess-url-and-create-metadata-object.helper.util";
import createChangeProfileManagersTypedDataLensService from "../services/lens/create-change-profile-managers-typed-data.lens.service";
import { signedTypeData } from "../utils/helpers/sign-type-data.helper.util";
import broadcastOnchainRequestService from "../services/lens/broadcast-onchain-request.lens.service";
import { waitUntilBroadcastIsCompleteTransactionUtil } from "../utils/transaction/wait-until-broadcast-is-complete.transaction.util";
import { getPolygonGasPriceHelperUtil } from "../utils/helpers/get-polygon-gas-price.helper.utils";
import { splitSignatureHelperUtil } from "../utils/helpers/split-signature.helper.utils";
import { createContractHelperUtils } from "../utils/helpers/create-contract.helper.utils";
import { hasTransactionBeenIndexedIndexerUtil } from "../utils/indexer/has-transaction-been-indexed.indexer.util";
import { getCommentMethod } from "../config/app-config.config";
import { uploadImageFromDisk } from "../utils/helpers/upload-image-from-disk.helper.util";
import { httpStatusCodes } from "../config/app-constants.config";
import {
  APP_ADDRESS,
  APP_LENS_HANDLE,
  APP_LENS_ID,
  LENS_HUB_CONTRACT_ADDRESS,
  USE_GASLESS
} from "../config/env.config";
import { logger } from "../log/log-manager.log";

/**
 * Adds an image to a post in the admin controller.
 *
 * @param {Request<unknown, unknown, AddImageToPostAdminRouteBodyRequestModel>} req - The HTTP request object.
 * @param {Response<PublicationResponseModel>} res - The HTTP response object.
 * @return {Promise<void>} A promise that resolves to nothing.
 */
export const addImageToPostAdminController = async (
  req: Request<unknown, unknown, AddImageToPostAdminRouteBodyRequestModel>,
  res: Response<PublicationResponseModel>
) => {
  logger.info(
    "admin.controller.ts: addImageToPostAdminController: Execution Started."
  );
  logger.info(
    "admin.controller.ts: addImageToPostAdminController: Request Body: " +
      JSON.stringify(req.body)
  );
  try {
    const { url } = req.body;
    const urlString = isInputTypeURLHelperUtil(url);
    const urlObj = preprocessURLAndCreateMetadataObjectHelperUtil(
      urlString ? urlString : url,
      APP_LENS_HANDLE,
      null,
      []
    );
    const publicationExists = await relatedParentPublicationsLensService([
      urlObj.hashedURL
    ]);
    if (publicationExists && publicationExists.items.length > 0) {
      logger.info(
        "admin.controller.ts: addImageToPostAdminController: Publication found. Adding Image to Publication."
      );
      await uploadScreenshotAndCommentWithImageJobUtil(urlObj);
      logger.info(
        "admin.controller.ts: addImageToPostAdminController: Execution Ended. Image Added To Post."
      );
      return res.status(httpStatusCodes.CREATED).send({
        publicationID: publicationExists.items[0].id,
        message: "Image Added To Post"
      });
    } else {
      logger.info(
        "admin.controller.ts: addImageToPostAdminController: Execution Ended. Publication not found."
      );
      return res.status(httpStatusCodes.OK).send({
        publicationID: null,
        message: "Could Not Find Publication"
      });
    }
  } catch (error) {
    logger.error(
      "admin.controller.ts: addImageToPostAdminController: Error in execution: " +
        error
    );
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      publicationID: null,
      message: "Error:" + error
    });
  }
};

export const approveSignlessAdminController = async (
  req: Request<unknown, unknown, ApproveSignlessAdminRouteBodyRequestModel>,
  res: Response
) => {
  logger.info(
    "admin.controller.ts: approveSignlessAdminController: Execution Started."
  );
  try {
    if (!APP_LENS_ID) {
      logger.error(
        "admin.controller.ts: approveSignlessAdminController: Must define APP_LENS_ID in the .env to run this"
      );
      throw new Error("Must define PROFILE_ID in the .env to run this");
    }
    const { approveSignless } = req.body;
    const { id, typedData } =
      await createChangeProfileManagersTypedDataLensService({
        approveSignless
        // leave it blank if you want to use the lens API manager!
        // changeManagers: [
        //   {
        //     action: ChangeProfileManagerActionType.Add,
        //     address: '0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF',
        //   },
        // ],
      });

    const signature = await signedTypeData(
      typedData.domain,
      typedData.types,
      typedData.value
    );
    logger.info(
      "admin.controller.ts: approveSignlessAdminController: signature" +
        signature
    );

    if (USE_GASLESS) {
      logger.info(
        "admin.controller.ts: approveSignlessAdminController: Gasless Execution Started."
      );
      const broadcastResult = (await broadcastOnchainRequestService({
        id,
        signature
      })) as RelaySuccess | RelayError;

      await waitUntilBroadcastIsCompleteTransactionUtil(
        broadcastResult,
        "change profile manager"
      );
    } else {
      logger.info(
        "admin.controller.ts: approveSignlessAdminController: Non-Gasless Execution Started."
      );
      const polygonGasFee = await getPolygonGasPriceHelperUtil();
      const { v, r, s } = splitSignatureHelperUtil(signature);

      const lensHub = createContractHelperUtils(
        LENS_HUB_CONTRACT_ADDRESS,
        LENS_HUB_ABI
      );

      const tx = await lensHub.changeDelegatedExecutorsConfigWithSig(
        typedData.value.delegatorProfileId,
        typedData.value.delegatedExecutors,
        typedData.value.approvals,
        typedData.value.configNumber,
        typedData.value.switchToGivenConfig,
        {
          signer: APP_ADDRESS,
          v,
          r,
          s,
          deadline: typedData.value.deadline
        },
        {
          maxFeePerGas: polygonGasFee.maxFeePerGas,
          maxPriorityFeePerGas: polygonGasFee.maxPriorityFeePerGas
        }
      );

      await hasTransactionBeenIndexedIndexerUtil(
        {
          forTxHash: tx.hash
        },
        Date.now()
      );
      logger.info(
        "admin.controller.ts: approveSignlessAdminController: Non-Gasless Execution Ended. Transaction Hash: " +
          tx.hash
      );
      console.log("change profile manager: tx hash", tx.hash);
    }
    logger.info(
      "admin.controller.ts: approveSignlessAdminController: Execution Ended. Lens Profile Manager Updated."
    );
    return res.status(httpStatusCodes.OK).send({
      message: "Lens Profile Manager Updated"
    });
  } catch (error) {
    logger.error(
      "admin.controller.ts: approveSignlessAdminController: Error in execution: " +
        error
    );
    throw new InternalServerError(
      "Error",
      httpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateMainPostImageController = async (
  req: Request,
  res: Response
) => {
  try {
    logger.info(
      "admin.controller.ts : updateMainPostImageController: Execution Started."
    );
    const { url, filename } = req.body;
    const urlString = isInputTypeURLHelperUtil(url);
    const urlObj = preprocessURLAndCreateMetadataObjectHelperUtil(
      urlString ? urlString : url,
      APP_LENS_HANDLE,
      null,
      []
    );
    const publicationExists = await relatedParentPublicationsLensService([
      urlObj.hashedURL
    ]);
    const imageMetadata = await uploadImageFromDisk(filename, urlObj);
    await getCommentMethod()(publicationExists.items[0].id, imageMetadata);
    logger.info(
      "admin.controller.ts : updateMainPostImageController: Image Updated. Execution Ended."
    );
    return res.status(httpStatusCodes.OK).send({
      message: "Image updated"
    });
  } catch (error) {
    logger.info(
      "admin.controller.ts : updateMainPostImageController: Failed. Execution Ended."
    );
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed: " + error
    });
  }
};
