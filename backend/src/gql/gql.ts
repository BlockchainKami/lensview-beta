/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  mutation Authenticate($request: SignedAuthChallenge!) {\n    authenticate(request: $request) {\n      accessToken\n      refreshToken\n    }\n  }\n":
    types.AuthenticateDocument,
  "\n  mutation BroadcastOnMomoka($request: BroadcastRequest!) {\n    broadcastOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on RelayError {\n        __typename\n        reason\n      }\n    }\n  }\n":
    types.BroadcastOnMomokaDocument,
  "\n  mutation BroadcastOnchain($request: BroadcastRequest!) {\n    broadcastOnchain(request: $request) {\n      ... on RelaySuccess {\n        __typename\n        txHash\n        txId\n      }\n      ... on RelayError {\n        __typename\n        reason\n      }\n    }\n  }\n":
    types.BroadcastOnchainDocument,
  "\n  mutation CreateChangeProfileManagersTypedData(\n    $request: ChangeProfileManagersRequest!\n  ) {\n    createChangeProfileManagersTypedData(request: $request) {\n      expiresAt\n      id\n      typedData {\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        types {\n          ChangeDelegatedExecutorsConfig {\n            name\n            type\n          }\n        }\n        value {\n          nonce\n          deadline\n          delegatorProfileId\n          delegatedExecutors\n          approvals\n          configNumber\n          switchToGivenConfig\n        }\n      }\n    }\n  }\n":
    types.CreateChangeProfileManagersTypedDataDocument,
  "\n  mutation CommentOnMomoka($request: MomokaCommentRequest!) {\n    commentOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on LensProfileManagerRelayError {\n        reason\n      }\n    }\n  }\n":
    types.CommentOnMomokaDocument,
  "\n  mutation CreateMomokaCommentTypedData($request: MomokaCommentRequest!) {\n    createMomokaCommentTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Comment {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          actionModules\n          actionModulesInitDatas\n          contentURI\n          deadline\n          nonce\n          pointedProfileId\n          pointedPubId\n          profileId\n          referenceModule\n          referenceModuleData\n          referenceModuleInitData\n          referrerProfileIds\n          referrerPubIds\n        }\n      }\n    }\n  }\n":
    types.CreateMomokaCommentTypedDataDocument,
  "\n  mutation PostOnMomoka($request: MomokaPostRequest!) {\n    postOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on LensProfileManagerRelayError {\n        reason\n      }\n    }\n  }\n":
    types.PostOnMomokaDocument,
  "\n  mutation CreateMomokaPostTypedData($request: MomokaPostRequest!) {\n    createMomokaPostTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Post {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n":
    types.CreateMomokaPostTypedDataDocument,
  "\n  mutation CreateOnchainCommentTypedData($request: OnchainCommentRequest!) {\n    createOnchainCommentTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Comment {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          pointedProfileId\n          pointedPubId\n          referrerProfileIds\n          referrerPubIds\n          referenceModuleData\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n":
    types.CreateOnchainCommentTypedDataDocument,
  "\n  mutation CreateOnchainPostTypedData($request: OnchainPostRequest!) {\n    createOnchainPostTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Post {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n":
    types.CreateOnchainPostTypedDataDocument,
  "\n  query Challenge($request: ChallengeRequest!) {\n    challenge(request: $request) {\n      text\n      id\n    }\n  }\n":
    types.ChallengeDocument,
  "\n  query GetPublicationsImage($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          metadata {\n            ... on ImageMetadataV3 {\n              asset {\n                image {\n                  optimized {\n                    uri\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.GetPublicationsImageDocument,
  "\n  query Publications($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Post {\n          id\n        }\n      }\n    }\n  }\n":
    types.PublicationsDocument,
  "\n  query TextOnlyPublications(\n    $request: PublicationsRequest!\n    $reactionsRequest2: PublicationStatsReactionArgs\n  ) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          metadata {\n            ... on TextOnlyMetadataV3 {\n              content\n            }\n          }\n          stats {\n            upvotes: reactions(request: $reactionsRequest2)\n          }\n        }\n      }\n    }\n  }\n":
    types.TextOnlyPublicationsDocument,
  "\n  query lensTransactionStatus($request: LensTransactionStatusRequest!) {\n    lensTransactionStatus(request: $request) {\n      status\n      txHash\n      reason\n      extraInfo\n    }\n  }\n":
    types.LensTransactionStatusDocument
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Authenticate($request: SignedAuthChallenge!) {\n    authenticate(request: $request) {\n      accessToken\n      refreshToken\n    }\n  }\n"
): (typeof documents)["\n  mutation Authenticate($request: SignedAuthChallenge!) {\n    authenticate(request: $request) {\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation BroadcastOnMomoka($request: BroadcastRequest!) {\n    broadcastOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on RelayError {\n        __typename\n        reason\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation BroadcastOnMomoka($request: BroadcastRequest!) {\n    broadcastOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on RelayError {\n        __typename\n        reason\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation BroadcastOnchain($request: BroadcastRequest!) {\n    broadcastOnchain(request: $request) {\n      ... on RelaySuccess {\n        __typename\n        txHash\n        txId\n      }\n      ... on RelayError {\n        __typename\n        reason\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation BroadcastOnchain($request: BroadcastRequest!) {\n    broadcastOnchain(request: $request) {\n      ... on RelaySuccess {\n        __typename\n        txHash\n        txId\n      }\n      ... on RelayError {\n        __typename\n        reason\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateChangeProfileManagersTypedData(\n    $request: ChangeProfileManagersRequest!\n  ) {\n    createChangeProfileManagersTypedData(request: $request) {\n      expiresAt\n      id\n      typedData {\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        types {\n          ChangeDelegatedExecutorsConfig {\n            name\n            type\n          }\n        }\n        value {\n          nonce\n          deadline\n          delegatorProfileId\n          delegatedExecutors\n          approvals\n          configNumber\n          switchToGivenConfig\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation CreateChangeProfileManagersTypedData(\n    $request: ChangeProfileManagersRequest!\n  ) {\n    createChangeProfileManagersTypedData(request: $request) {\n      expiresAt\n      id\n      typedData {\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        types {\n          ChangeDelegatedExecutorsConfig {\n            name\n            type\n          }\n        }\n        value {\n          nonce\n          deadline\n          delegatorProfileId\n          delegatedExecutors\n          approvals\n          configNumber\n          switchToGivenConfig\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CommentOnMomoka($request: MomokaCommentRequest!) {\n    commentOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on LensProfileManagerRelayError {\n        reason\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation CommentOnMomoka($request: MomokaCommentRequest!) {\n    commentOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on LensProfileManagerRelayError {\n        reason\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateMomokaCommentTypedData($request: MomokaCommentRequest!) {\n    createMomokaCommentTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Comment {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          actionModules\n          actionModulesInitDatas\n          contentURI\n          deadline\n          nonce\n          pointedProfileId\n          pointedPubId\n          profileId\n          referenceModule\n          referenceModuleData\n          referenceModuleInitData\n          referrerProfileIds\n          referrerPubIds\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation CreateMomokaCommentTypedData($request: MomokaCommentRequest!) {\n    createMomokaCommentTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Comment {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          actionModules\n          actionModulesInitDatas\n          contentURI\n          deadline\n          nonce\n          pointedProfileId\n          pointedPubId\n          profileId\n          referenceModule\n          referenceModuleData\n          referenceModuleInitData\n          referrerProfileIds\n          referrerPubIds\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation PostOnMomoka($request: MomokaPostRequest!) {\n    postOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on LensProfileManagerRelayError {\n        reason\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation PostOnMomoka($request: MomokaPostRequest!) {\n    postOnMomoka(request: $request) {\n      ... on CreateMomokaPublicationResult {\n        id\n        proof\n        momokaId\n      }\n      ... on LensProfileManagerRelayError {\n        reason\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateMomokaPostTypedData($request: MomokaPostRequest!) {\n    createMomokaPostTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Post {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation CreateMomokaPostTypedData($request: MomokaPostRequest!) {\n    createMomokaPostTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Post {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateOnchainCommentTypedData($request: OnchainCommentRequest!) {\n    createOnchainCommentTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Comment {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          pointedProfileId\n          pointedPubId\n          referrerProfileIds\n          referrerPubIds\n          referenceModuleData\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation CreateOnchainCommentTypedData($request: OnchainCommentRequest!) {\n    createOnchainCommentTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Comment {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          pointedProfileId\n          pointedPubId\n          referrerProfileIds\n          referrerPubIds\n          referenceModuleData\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateOnchainPostTypedData($request: OnchainPostRequest!) {\n    createOnchainPostTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Post {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation CreateOnchainPostTypedData($request: OnchainPostRequest!) {\n    createOnchainPostTypedData(request: $request) {\n      id\n      expiresAt\n      typedData {\n        types {\n          Post {\n            name\n            type\n          }\n        }\n        domain {\n          name\n          chainId\n          version\n          verifyingContract\n        }\n        value {\n          nonce\n          deadline\n          profileId\n          contentURI\n          actionModules\n          actionModulesInitDatas\n          referenceModule\n          referenceModuleInitData\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Challenge($request: ChallengeRequest!) {\n    challenge(request: $request) {\n      text\n      id\n    }\n  }\n"
): (typeof documents)["\n  query Challenge($request: ChallengeRequest!) {\n    challenge(request: $request) {\n      text\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetPublicationsImage($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          metadata {\n            ... on ImageMetadataV3 {\n              asset {\n                image {\n                  optimized {\n                    uri\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query GetPublicationsImage($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          metadata {\n            ... on ImageMetadataV3 {\n              asset {\n                image {\n                  optimized {\n                    uri\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Publications($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Post {\n          id\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query Publications($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Post {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query TextOnlyPublications(\n    $request: PublicationsRequest!\n    $reactionsRequest2: PublicationStatsReactionArgs\n  ) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          metadata {\n            ... on TextOnlyMetadataV3 {\n              content\n            }\n          }\n          stats {\n            upvotes: reactions(request: $reactionsRequest2)\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query TextOnlyPublications(\n    $request: PublicationsRequest!\n    $reactionsRequest2: PublicationStatsReactionArgs\n  ) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          metadata {\n            ... on TextOnlyMetadataV3 {\n              content\n            }\n          }\n          stats {\n            upvotes: reactions(request: $reactionsRequest2)\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query lensTransactionStatus($request: LensTransactionStatusRequest!) {\n    lensTransactionStatus(request: $request) {\n      status\n      txHash\n      reason\n      extraInfo\n    }\n  }\n"
): (typeof documents)["\n  query lensTransactionStatus($request: LensTransactionStatusRequest!) {\n    lensTransactionStatus(request: $request) {\n      status\n      txHash\n      reason\n      extraInfo\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
