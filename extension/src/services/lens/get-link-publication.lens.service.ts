import baseClientAuthenticationUtil from "../../utils/authentication/base-client.authentication.util";
import linkPublicationQueryGraphql from "../../graphql/queries/link-publication.query.graphql";
import type { LinkPublicationLensModel } from "../../models/lens/link-publication.lens.model";

const getLinkPublicationLensService = async (publicationId: string) => {
  console.log("getLinkPublicationLensService publicationId", publicationId);

  const result = await baseClientAuthenticationUtil
    .query(linkPublicationQueryGraphql, {
      request: {
        forId: publicationId
      }
    })
    .toPromise();

  return result?.data?.publication as LinkPublicationLensModel;
};

export default getLinkPublicationLensService;
