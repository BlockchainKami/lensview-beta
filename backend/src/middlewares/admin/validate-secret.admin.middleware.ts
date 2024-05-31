import { Request, Response, NextFunction } from "express";
import {
  AddImageToPostAdminRouteBodyRequestModel,
  ApproveSignlessAdminRouteBodyRequestModel,
  UpdateImageToPostAdminRouteBodyRequestModel
} from "../../models/requests/body/admin-route.body.request.model";
import { ClientError } from "../../errors/client-error.error";
import { createHashHelperUtil } from "../../utils/helpers/create-hash.helper.util";
import { logger } from "../../log/log-manager.log";
import { httpStatusCodes } from "../../config/app-constants.config";

/**
 * Validates the secret key and URL in the request body and throws an error if they are invalid.
 *
 * @param {Request<unknown, unknown, AddImageToPostAdminRouteBodyRequestModel>} req - The request object.
 * @param {Response} _res - The response object.
 * @param {NextFunction} next - The next function.
 * @throws {ClientError} If the secret key or URL is invalid.
 */
export const validateSecretAdminMiddleware = (
  req: Request<
    unknown,
    unknown,
    | AddImageToPostAdminRouteBodyRequestModel
    | ApproveSignlessAdminRouteBodyRequestModel
  >,
  _res: Response,
  next: NextFunction
) => {
  logger.info(
    "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Execution Started."
  );
  logger.info(
    "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Path: " +
      req.path
  );
  logger.info(
    "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Body: " +
      JSON.stringify(req.body)
  );
  const { secretKey } = req.body;
  if (secretKey) {
    if (
      createHashHelperUtil(secretKey) ===
      "5757c384c37f705ef28f68ed0e5932830c0a3393"
    ) {
      if (req.path == "/add-post-image") {
        if (req.body.url) {
          logger.info(
            "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Validation Successfull for path: " +
              req.path
          );
          next();
        } else {
          logger.error(
            "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Validation Failed for path: " +
              req.path
          );
          throw new ClientError(
            "Check the request body: correct secretKey and 'url' must be supplied",
            httpStatusCodes.BAD_REQUEST
          );
        }
      } else if (req.path == "/approve-signless") {
        if (req.body.approveSignless !== undefined) {
          logger.info(
            "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Validation Successfull for path: " +
              req.path
          );
          next();
        } else {
          logger.error(
            "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Validation Failed for path: " +
              req.path
          );
          throw new ClientError(
            "Check the request body: correct secretKey and 'approveSignless' must be supplied",
            httpStatusCodes.BAD_REQUEST
          );
        }
      }
    } else {
      logger.error(
        "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Validation Failed for path: " +
          req.path
      );
      throw new ClientError(
        "Check the request body: incorrect secretKey supplied",
        httpStatusCodes.FORBIDDEN
      );
    }
  } else {
    logger.info(
      "validate-secret.admin.middleware.ts: validateSecretAdminMiddleware: Validation Failed for path: " +
        req.path
    );
    throw new ClientError(
      "Check the request body. secretKey must be supplied",
      400
    );
  }
};

export const validateUpdatePostImageMiddleware = (
  req: Request<unknown, unknown, UpdateImageToPostAdminRouteBodyRequestModel>,
  _res: Response,
  next: NextFunction
) => {
  logger.info(
    "validate-secret.admin.middleware.ts: validateUpdatePostImageMiddleware: Execution Started."
  );
  logger.info(
    "validate-secret.admin.middleware.ts: validateUpdatePostImageMiddleware: Body: " +
      JSON.stringify(req.body)
  );
  const { secretKey } = req.body;
  if (
    createHashHelperUtil(secretKey) ===
    "5757c384c37f705ef28f68ed0e5932830c0a3393"
  ) {
    if (req.body.url && req.body.filename) {
      logger.info(
        "validate-secret.admin.middleware.ts: validateUpdatePostImageMiddleware: Validation Successfull."
      );
      next();
    } else {
      throw new ClientError(
        "Check the request body: 'url' and 'filename' must be supplied",
        httpStatusCodes.BAD_REQUEST
      );
    }
  } else {
    logger.info(
      "validate-secret.admin.middleware.ts: validateUpdatePostImageMiddleware: Validation Failed."
    );
    throw new ClientError(
      "Check the request body: incorrect secretKey supplied",
      httpStatusCodes.FORBIDDEN
    );
  }
};
