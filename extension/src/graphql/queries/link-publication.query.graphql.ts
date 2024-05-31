import { graphql } from "../../gql";

const linkPublicationQueryGraphql = graphql(`
  query LinkPublication($request: PublicationRequest!) {
    publication(request: $request) {
      ... on Post {
        id
        createdAt
        by {
          handle {
            fullHandle
          }
        }
        stats {
          comments
          upvotes: reactions(request: { type: UPVOTE })
          downvotes: reactions(request: { type: DOWNVOTE })
        }
        metadata {
          ... on LinkMetadataV3 {
            sharingLink
            attributes {
              key
              value
            }
          }
        }
        operations {
          hasUpVoted: hasReacted(request: { type: UPVOTE })
          hasDownVoted: hasReacted(request: { type: DOWNVOTE })
        }
      }
    }
  }
`);

export default linkPublicationQueryGraphql;
