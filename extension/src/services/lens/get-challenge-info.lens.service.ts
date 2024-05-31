import baseClientAuthenticationUtil from "../../utils/authentication/base-client.authentication.util";
import challengeQueryGraphql from "../../graphql/queries/challenge.query.graphql";

const getChallengeInfoLensService = async (address: string, id: string) => {
  console.log("getChallengeInfoLensService signedBy", address);
  console.log("getChallengeInfoLensService for", id);

  return await baseClientAuthenticationUtil
    .query(challengeQueryGraphql, {
      request: {
        signedBy: address,
        for: id
      }
    })
    .toPromise();
};

export default getChallengeInfoLensService;
