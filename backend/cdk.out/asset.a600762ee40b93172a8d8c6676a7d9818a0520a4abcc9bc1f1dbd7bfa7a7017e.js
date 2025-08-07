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
    return {
      operation: "Scan",
      limit,
      nextToken,
    };
  }
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}
