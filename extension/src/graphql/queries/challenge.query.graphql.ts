import { graphql } from "../../gql";

const challengeQueryGraphql = graphql(`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
      id
    }
  }
`);

export default challengeQueryGraphql;
