import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { sentiment, limit = 10, nextToken } = ctx.arguments;

  if (sentiment) {
    // query by sentiment using SentimentIndex (already sorted by date)
    return {
      operation: "Query",
      index: "SentimentIndex",
      query: {
        expression: "sentiment = :sentiment",
        expressionValues: {
          ":sentiment": sentiment,
        },
      },
      scanIndexForward: false, // Newest first
      limit,
      nextToken,
    };
  } else {
    // query all notes sorted by date using DateIndex
    return {
      operation: "Query",
      index: "DateIndex",
      query: {
        expression: "#type = :type",
        expressionNames: {
          "#type": "type",
        },
        expressionValues: {
          ":type": "NOTE",
        },
      },
      scanIndexForward: false, // newest first
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
