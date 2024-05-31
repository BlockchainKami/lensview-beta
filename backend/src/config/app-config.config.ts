import { POST_AND_COMMENT_CONFIG, POST_AND_COMMENT_TYPES } from "./env.config";
import postOnchainPublicationUtil from "../utils/publications/post-onchain.publication.util";
import commentOnchainPublicationUtil from "../utils/publications/comment-onchain.publication.util";
import { postMomokaProfileManagerPublicationUtil } from "../utils/publications/post-momoka-profile-manager.publication.util";
import { commentMomokaProfileManagerPublicationUtil } from "../utils/publications/comment-momoka-profile-manager.publication.util";
import { postMomokaPublicationUtil } from "../utils/publications/post-momoka.publication.util";
import { commentMomokaPublicationUtil } from "../utils/publications/comment-momoka.publication.util";

export const ALLOWED_ORIGINS = {
  DEVELOPMENT: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
    "https://testnet.lensview.io",
    "chrome-extension://nofkbijjbdeenhlekpehmkdoopfccdkf"
  ],
  PRODUCTION: [
    "https://lensview.io",
    "chrome-extension://bhbcbfcabkodjhgkjccnoflnffcfkfnd"
  ]
};

export const getPostMethod = () => {
  switch (POST_AND_COMMENT_CONFIG) {
    case POST_AND_COMMENT_TYPES.MOMOKA:
      return postMomokaPublicationUtil;
    case POST_AND_COMMENT_TYPES.PROFILE_MANAGER:
      return postMomokaProfileManagerPublicationUtil;
    case POST_AND_COMMENT_TYPES.ON_CHAIN:
      return postOnchainPublicationUtil;
    default:
      return postOnchainPublicationUtil;
  }
};

export const getCommentMethod = () => {
  switch (POST_AND_COMMENT_CONFIG) {
    case POST_AND_COMMENT_TYPES.MOMOKA:
      return commentMomokaPublicationUtil;
    case POST_AND_COMMENT_TYPES.PROFILE_MANAGER:
      return commentMomokaProfileManagerPublicationUtil;
    case POST_AND_COMMENT_TYPES.ON_CHAIN:
      return commentOnchainPublicationUtil;
    default:
      return commentOnchainPublicationUtil;
  }
};
