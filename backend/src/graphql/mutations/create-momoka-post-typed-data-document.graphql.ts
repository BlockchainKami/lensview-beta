import { graphql } from "../../gql";

const CreateMomokaPostTypedDataDocument = graphql(`
  mutation CreateMomokaPostTypedData($request: MomokaPostRequest!) {
    createMomokaPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          Post {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          actionModules
          actionModulesInitDatas
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`);

export default CreateMomokaPostTypedDataDocument;
