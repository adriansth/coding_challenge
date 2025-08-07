import { util } from "@aws-appsync/utils";

export function request(ctx) {
  // generate ULID for unique, sortable IDs
  const id = util.autoUlid();
  const now = util.time.nowISO8601();
  // validation
  if (!ctx.arguments.text || ctx.arguments.text.trim().length === 0) {
    util.error("Text is required", "ValidationError");
  }
  if (ctx.arguments.text.length > 500) {
    util.error("Text must be less than 500 characters", "ValidationError");
  }
  const validSentiments = ["happy", "sad", "neutral", "angry"];
  if (!validSentiments.includes(ctx.arguments.sentiment)) {
    util.error("Invalid sentiment", "ValidationError");
  }
  return {
    operation: "PutItem",
    key: {
      id: util.dynamodb.toDynamoDB(id),
      dateCreated: util.dynamodb.toDynamoDB(now),
    },
    attributeValues: {
      text: util.dynamodb.toDynamoDB(ctx.arguments.text.trim()),
      sentiment: util.dynamodb.toDynamoDB(ctx.arguments.sentiment),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result;
}
