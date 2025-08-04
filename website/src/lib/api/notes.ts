import { graphqlOperation } from "../graphql/client";
import { CREATE_NOTE, GET_NOTES } from "../graphql/queries";
import { Sentiment } from "@/types/note";

export async function createNote(text: string, sentiment: Sentiment) {
   try {
      console.log("Creating note...", { text, sentiment });
      const result = await graphqlOperation(CREATE_NOTE, {
         text: text.trim(),
         sentiment,
      });
      if (result && result.data && result.data.createNote) {
         console.log("Note created successfully:", result.data);
         return result.data.createNote;
      }
   } catch (err) {
      console.error("Failed to create note:", err);
      throw new Error("Failed to create note. Please try again.");
   }
}

export async function getNotes(
   sentiment?: Sentiment | null,
   limit = 10,
   nextToken?: string
) {
   try {
      console.log("Fetching notes...", { sentiment, limit, nextToken });
      const variables: any = { limit };
      if (sentiment) variables.sentiment = sentiment;
      if (nextToken) variables.nextToken = nextToken;
      const result = await graphqlOperation(GET_NOTES, variables);
      if (result && result.data && result.data.getNotes) {
         console.log("Notes fetched successfully:", result.data);
         return result.data.getNotes;
      }
   } catch (err) {
      console.error("Failed to fetch notes:", err);
      throw new Error("Failed to fetch notes. Please try again.");
   }
}
