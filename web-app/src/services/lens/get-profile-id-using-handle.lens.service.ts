import baseClientAuthenticationUtil from "../../utils/authentication/base-client.authentication.util";
import profileIdQueryGraphql from "../../graphql/queries/profile-id.query.graphql";

const getProfileIdUsingHandleLensService = async (handle: string) => {
  console.log("getProfileUsingHandleLensService handle", handle);

  return await baseClientAuthenticationUtil
    .query(profileIdQueryGraphql, {
      request: { forHandle: handle }
    })
    .toPromise();
};

export default getProfileIdUsingHandleLensService;
