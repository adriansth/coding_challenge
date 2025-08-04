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
         limit,
         nextToken,
      };
   }
}

export function response(ctx) {
   if (ctx.error) {
      console.error("DynamoDB Error:", ctx.error);
      util.error(ctx.error.message, ctx.error.type);
   }
   return {
      items: ctx.result.items || [],
      nextToken: ctx.result.nextToken || null,
      scannedCount: ctx.result.scannedCount || 0,
   };
}
