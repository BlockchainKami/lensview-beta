/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

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
    "\n  query Challenge($request: ChallengeRequest!) {\n    challenge(request: $request) {\n      text\n      id\n    }\n  }\n": types.ChallengeDocument,
    "\n  query CommentsPublication($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          id\n          createdAt\n          by {\n            id\n            handle {\n              fullHandle\n            }\n            metadata {\n              picture {\n                ... on ImageSet {\n                  optimized {\n                    uri\n                  }\n                }\n              }\n              displayName\n            }\n            ownedBy {\n              address\n            }\n          }\n          stats {\n            comments\n            upvotes: reactions(request: { type: UPVOTE })\n            downvotes: reactions(request: { type: DOWNVOTE })\n          }\n          metadata {\n            ... on TextOnlyMetadataV3 {\n              content\n              tags\n              attributes {\n                value\n                key\n              }\n            }\n            ... on ImageMetadataV3 {\n              content\n              tags\n            }\n          }\n          operations {\n            hasUpVoted: hasReacted(request: { type: UPVOTE })\n            hasDownVoted: hasReacted(request: { type: DOWNVOTE })\n          }\n          root {\n            ... on Post {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": types.CommentsPublicationDocument,
    "\n  query LinkPublication($request: PublicationRequest!) {\n    publication(request: $request) {\n      ... on Post {\n        id\n        createdAt\n        by {\n          handle {\n            fullHandle\n          }\n        }\n        stats {\n          comments\n          upvotes: reactions(request: { type: UPVOTE })\n          downvotes: reactions(request: { type: DOWNVOTE })\n        }\n        metadata {\n          ... on LinkMetadataV3 {\n            sharingLink\n            attributes {\n              key\n              value\n            }\n          }\n        }\n        operations {\n          hasUpVoted: hasReacted(request: { type: UPVOTE })\n          hasDownVoted: hasReacted(request: { type: DOWNVOTE })\n        }\n      }\n    }\n  }\n": types.LinkPublicationDocument,
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
export function graphql(source: "\n  query Challenge($request: ChallengeRequest!) {\n    challenge(request: $request) {\n      text\n      id\n    }\n  }\n"): (typeof documents)["\n  query Challenge($request: ChallengeRequest!) {\n    challenge(request: $request) {\n      text\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CommentsPublication($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          id\n          createdAt\n          by {\n            id\n            handle {\n              fullHandle\n            }\n            metadata {\n              picture {\n                ... on ImageSet {\n                  optimized {\n                    uri\n                  }\n                }\n              }\n              displayName\n            }\n            ownedBy {\n              address\n            }\n          }\n          stats {\n            comments\n            upvotes: reactions(request: { type: UPVOTE })\n            downvotes: reactions(request: { type: DOWNVOTE })\n          }\n          metadata {\n            ... on TextOnlyMetadataV3 {\n              content\n              tags\n              attributes {\n                value\n                key\n              }\n            }\n            ... on ImageMetadataV3 {\n              content\n              tags\n            }\n          }\n          operations {\n            hasUpVoted: hasReacted(request: { type: UPVOTE })\n            hasDownVoted: hasReacted(request: { type: DOWNVOTE })\n          }\n          root {\n            ... on Post {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CommentsPublication($request: PublicationsRequest!) {\n    publications(request: $request) {\n      items {\n        ... on Comment {\n          id\n          createdAt\n          by {\n            id\n            handle {\n              fullHandle\n            }\n            metadata {\n              picture {\n                ... on ImageSet {\n                  optimized {\n                    uri\n                  }\n                }\n              }\n              displayName\n            }\n            ownedBy {\n              address\n            }\n          }\n          stats {\n            comments\n            upvotes: reactions(request: { type: UPVOTE })\n            downvotes: reactions(request: { type: DOWNVOTE })\n          }\n          metadata {\n            ... on TextOnlyMetadataV3 {\n              content\n              tags\n              attributes {\n                value\n                key\n              }\n            }\n            ... on ImageMetadataV3 {\n              content\n              tags\n            }\n          }\n          operations {\n            hasUpVoted: hasReacted(request: { type: UPVOTE })\n            hasDownVoted: hasReacted(request: { type: DOWNVOTE })\n          }\n          root {\n            ... on Post {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LinkPublication($request: PublicationRequest!) {\n    publication(request: $request) {\n      ... on Post {\n        id\n        createdAt\n        by {\n          handle {\n            fullHandle\n          }\n        }\n        stats {\n          comments\n          upvotes: reactions(request: { type: UPVOTE })\n          downvotes: reactions(request: { type: DOWNVOTE })\n        }\n        metadata {\n          ... on LinkMetadataV3 {\n            sharingLink\n            attributes {\n              key\n              value\n            }\n          }\n        }\n        operations {\n          hasUpVoted: hasReacted(request: { type: UPVOTE })\n          hasDownVoted: hasReacted(request: { type: DOWNVOTE })\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query LinkPublication($request: PublicationRequest!) {\n    publication(request: $request) {\n      ... on Post {\n        id\n        createdAt\n        by {\n          handle {\n            fullHandle\n          }\n        }\n        stats {\n          comments\n          upvotes: reactions(request: { type: UPVOTE })\n          downvotes: reactions(request: { type: DOWNVOTE })\n        }\n        metadata {\n          ... on LinkMetadataV3 {\n            sharingLink\n            attributes {\n              key\n              value\n            }\n          }\n        }\n        operations {\n          hasUpVoted: hasReacted(request: { type: UPVOTE })\n          hasDownVoted: hasReacted(request: { type: DOWNVOTE })\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
