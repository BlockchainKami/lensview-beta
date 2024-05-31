export interface GetTextOnlyCommentsLensModel {
  __typename: "PaginatedPublicationsResult";
  items: {
    __typename: "Comment";
    metadata: {
      __typename: "TextOnlyMetadataV3";
      content: string;
    };
    stats: {
      __typename: "PublicationStats";
      upvotes: number;
    };
  }[];
}
