import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { sentiment, limit = 10, nextToken } = ctx.arguments;

  if (sentiment) {
    return {
      operation: "Query",
      index: "SentimentIndex",
      query: {
        expression: "sentiment = :sentiment",
        expressionValues: {
          ":sentiment": sentiment,
        },
      },
      scanIndexForward: false,
      limit,
      nextToken,
    };
  } else {
    ctx.stash.isAllNotesQuery = true;
    return {
      operation: "Query",
      index: "SentimentIndex",
      query: {
        expression: "sentiment = :sentiment",
        expressionValues: {
          ":sentiment": "happy",
        },
      },
      scanIndexForward: false,
      limit: limit * 2,
    };
  }
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  if (!ctx.stash.isAllNotesQuery) {
    return ctx.result;
  }
  return ctx.result;
}
