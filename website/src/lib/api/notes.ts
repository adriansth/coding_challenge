import { graphqlOperation } from "../graphql/client";
import { CREATE_NOTE, GET_NOTES } from "../graphql/queries";
import { Sentiment } from "@/types/note";

export async function createNote(text: string, sentiment: Sentiment) {
   try {
      const result = await graphqlOperation(CREATE_NOTE, {
         text: text.trim(),
         sentiment,
      });
      if (result && result.data && result.data.createNote) {
         return result.data.createNote;
      }
   } catch (err) {
      throw new Error("Failed to create note. Please try again.");
   }
}

export async function getNotes(
   sentiment?: Sentiment | null,
   limit = 10,
   nextToken?: string | null
) {
   try {
      const variables: any = { limit };
      if (nextToken) variables.nextToken = nextToken;
      const result = await graphqlOperation(GET_NOTES, variables);
      if (result && result.data && result.data.getNotes) {
         let items = result.data.getNotes.items || [];
         if (sentiment) {
            items = items.filter((note: any) => note.sentiment === sentiment);
         }
         return {
            items,
            nextToken: result.data.getNotes.nextToken,
         };
      }
   } catch (err) {
      throw new Error("Failed to fetch notes. Please try again.");
   }
}
