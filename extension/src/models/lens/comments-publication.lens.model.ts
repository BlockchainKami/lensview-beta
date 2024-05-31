import type { AttributeKeyType } from "../../config/app-constants.config";

export interface CommentsPublicationLensModel {
  __typename: "Comment";
  id: string;
  createdAt: string;
  by: {
    id: string;
    handle: {
      fullHandle: string;
    };
    metadata: {
      picture: {
        __typename: "ImageSet";
        optimized: {
          uri: string;
        };
      };
      displayName: string;
    };
    ownedBy: {
      address: string;
    };
  };
  metadata: {
    __typename: "TextOnlyMetadataV3";
    content: string;
    attributes: {
      value: string;
      key: AttributeKeyType;
    }[];
    tags: string[];
  };
  stats: {
    comments: number;
    upvotes: number;
    downvotes: number;
  };
  operations: {
    hasUpVoted: boolean;
    hasDownVoted: boolean;
  };
  root: {
    __typename: "Post";
    id: string;
  };
}
