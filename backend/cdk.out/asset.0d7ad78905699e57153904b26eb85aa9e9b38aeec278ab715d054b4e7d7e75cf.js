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
      limit: limit * 3,
      nextToken,
    };
  }
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  let items = ctx.result.items || [];
  const requestedLimit = ctx.arguments.limit || 10;
  if (!ctx.arguments.sentiment) {
    items = items.sort((a, b) => {
      const dateA = a.dateCreated || "";
      const dateB = b.dateCreated || "";
      if (dateB > dateA) return 1;
      if (dateB < dateA) return -1;
      return 0;
    });
    items = items.slice(0, requestedLimit);
  }
  return {
    items,
    nextToken: ctx.result.nextToken,
    scannedCount: ctx.result.scannedCount || 0,
  };
}
