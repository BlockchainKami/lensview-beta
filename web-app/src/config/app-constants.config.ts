export enum AppReactionType {
  UpVote = "UPVOTE",
  DownVote = "DOWNVOTE",
  NoReaction = "NOREACTION"
}

export enum CommentFilterType {
  MostLikedComments = "MOST_LIKED_COMMENTS",
  LatestComments = "LATEST_COMMENTS",
  CommentsById = "COMMENTS_BY_ID",
  FirstMostRelevantComments = "FIRST_MOST_RELEVANT_COMMENTS"
}

export enum DateType {
  ExactDate = "EXACT_DATE",
  RoughDate = "ROUGH_DATE"
}

export enum AttributeKeyType {
  creator = "creator",
  app = "app",
  createdOn = "createdOn",
  mainPostImageUrl = "mainPostImageUrl",
  mainPostUrl = "mainPostUrl"
}

export enum SentimentColor {
  positive = "#3EE54E",
  negative = "#FDB84D",
  neutral = "#6C6C6C"
}

export enum summarySentiment {
  positive = "POSITIVE",
  negative = "NEGATIVE",
  neutral = "NEUTRAL"
}
