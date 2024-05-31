import { graphql } from "../../gql";

const commentsPublicationQueryGraphql = graphql(`
  query CommentsPublication($request: PublicationsRequest!) {
    publications(request: $request) {
      items {
        ... on Comment {
          id
          createdAt
          by {
            id
            handle {
              fullHandle
            }
            metadata {
              picture {
                ... on ImageSet {
                  optimized {
                    uri
                  }
                }
              }
              displayName
            }
            ownedBy {
              address
            }
          }
          stats {
            comments
            upvotes: reactions(request: { type: UPVOTE })
            downvotes: reactions(request: { type: DOWNVOTE })
          }
          metadata {
            ... on TextOnlyMetadataV3 {
              content
              tags
              attributes {
                value
                key
              }
            }
            ... on ImageMetadataV3 {
              content
              tags
            }
          }
          operations {
            hasUpVoted: hasReacted(request: { type: UPVOTE })
            hasDownVoted: hasReacted(request: { type: DOWNVOTE })
          }
          root {
            ... on Post {
              id
            }
          }
        }
      }
    }
  }
`);

export default commentsPublicationQueryGraphql;
