import { graphql } from "../../gql";

const getTextOnlyCommentsOnPublicationQueryGraphql = graphql(/* GraphQL */ `
  query TextOnlyPublications(
    $request: PublicationsRequest!
    $reactionsRequest2: PublicationStatsReactionArgs
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          metadata {
            ... on TextOnlyMetadataV3 {
              content
            }
          }
          stats {
            upvotes: reactions(request: $reactionsRequest2)
          }
        }
      }
    }
  }
`);

export default getTextOnlyCommentsOnPublicationQueryGraphql;
