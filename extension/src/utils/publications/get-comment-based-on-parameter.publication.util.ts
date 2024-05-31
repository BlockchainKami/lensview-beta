import { CommentRankingFilterType, LimitType } from "../../gql/graphql";
import type { PublicationsRequest } from "../../gql/graphql";

import getCommentLensService from "../../services/lens/get-comment.lens.service";
import { CommentFilterType } from "../../config/app-constants.config";
const { VITE_USER_PUB } = import.meta.env;
const { VITE_ANONYMOUS_PUB } = import.meta.env;

const getCommentBasedOnParameterPublicationUtil = async (
  publicationId: string,
  limit: LimitType,
  filterBy = CommentFilterType.LatestComments
) => {
  try {
    let request: PublicationsRequest;
    if (filterBy === CommentFilterType.MostLikedComments) {
      request = {
        limit: limit,
        where: {
          commentOn: {
            id: publicationId,
            ranking: {
              filter: CommentRankingFilterType.Relevant
            }
          }
        }
      };
    } else if (filterBy === CommentFilterType.LatestComments) {
      request = {
        limit: limit,
        where: {
          commentOn: {
            id: publicationId
          }
        }
      };
    } else if (filterBy === CommentFilterType.CommentsById) {
      request = {
        limit: limit,
        where: {
          publicationIds: [publicationId]
        }
      };
    } else if (filterBy === CommentFilterType.FirstMostRelevantComments) {
      request = {
        limit: limit,
        where: {
          commentOn: {
            id: publicationId,
            ranking: {
              filter: CommentRankingFilterType.All
            }
          },
          metadata: {
            tags: {
              oneOf: [
                VITE_USER_PUB, //userPubHash
                VITE_ANONYMOUS_PUB //anonymousPubHash
              ]
            }
          }
        }
      };
    }

    return await getCommentLensService(request!);
  } catch (error) {
    console.log("getCommentBasedOnParameterPublicationUtil error", error);
    throw error;
  }
};

export default getCommentBasedOnParameterPublicationUtil;
