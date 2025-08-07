import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { sentiment, limit = 10, nextToken } = ctx.arguments;

  if (sentiment) {
    // query by sentiment using Global Secondary Index
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
    // scan all notes (when no sentiment filter)
    return {
      operation: "Scan",
      limit: limit * 3,
      nextToken,
    };
  }
}

export function response(ctx) {
  if (ctx.error) {
    console.error("DynamoDB Error:", ctx.error);
    util.error(ctx.error.message, ctx.error.type);
  }
  let items = ctx.result.items || [];
  if (!ctx.arguments.sentiment) {
    items = items.sort((a, b) => {
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);
      return dateB.getTime() - dateA.getTime;
    });
    const limit = ctx.arguments.limit || 10;
    items = items.slice(0, limit);
  }
  return {
    items,
    nextToken: ctx.result.nextToken || null,
    scannedCount: ctx.result.scannedCount || 0,
  };
}
