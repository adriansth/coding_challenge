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
      scanIndexForward: false, // newest first
      limit,
      nextToken,
    };
  } else {
    // scan all notes
    return {
      operation: "Scan",
      limit: limit * 2, // get more items for sorting
      nextToken,
    };
  }
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  let items = ctx.result.items || [];
  // sort by dateCreated
  if (!ctx.arguments.sentiment && items.length > 0) {
    items.sort((a, b) => {
      if (a.dateCreated && b.dateCreated) {
        return b.dateCreated.localeCompare(a.dateCreated);
      }
      return 0;
    });
    // apply limit after sorting
    const limit = ctx.arguments.limit || 10;
    items = items.slice(0, limit);
  }
  return {
    items,
    nextToken: ctx.result.nextToken || null,
    scannedCount: ctx.result.scannedCount || 0,
  };
}
