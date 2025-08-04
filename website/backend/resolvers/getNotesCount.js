import { util } from "@aws-appsync/utils";

export function request(ctx) {
   const { sentiment } = ctx.arguments;
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
         select: "COUNT", // only get the count, not the items
      };
   } else {
      // scan all notes (when no sentiment filter)
      return {
         operation: "Scan",
         select: "COUNT", // only get the count, not the items
      };
   }
}

export function response(ctx) {
   if (ctx.error) {
      console.error("DynamoDB Count Error:", ctx.error);
      util.error(ctx.error.message, ctx.error.type);
   }
   // return just the count number
   return ctx.result.count || 0;
}
