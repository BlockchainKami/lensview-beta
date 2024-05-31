import type { PublicationsRequest } from "../../gql/graphql";
import commentsPublicationQueryGraphql from "../../graphql/queries/comments-publication.query.graphql";
import baseClientAuthenticationUtil from "../../utils/authentication/base-client.authentication.util";
import type { CommentsPublicationLensModel } from "../../models/lens/comments-publication.lens.model";

const getCommentLensService = async (request: PublicationsRequest) => {
  console.log("getCommentLensService request", request);

  let result;

  result = await baseClientAuthenticationUtil
    .query(commentsPublicationQueryGraphql, { request })
    .toPromise();

  if (result?.data?.publications.__typename === "PaginatedPublicationsResult") {
    return result?.data?.publications?.items as CommentsPublicationLensModel[];
  } else {
    return [];
  }
};

export default getCommentLensService;
