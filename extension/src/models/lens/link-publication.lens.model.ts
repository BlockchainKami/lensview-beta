export interface LinkPublicationLensModel {
  __typename: "Post";
  id: string;
  createdAt: string;
  stats: {
    comments: number;
    upvotes: number;
    downvotes: number;
  };
  metadata: {
    __typename: "LinkMetadataV3";
    sharingLink: string;
    attributes: {
      key: string;
      value: string;
    }[];
  };
  operations: {
    hasUpVoted: boolean;
    hasDownVoted: boolean;
  };
}
