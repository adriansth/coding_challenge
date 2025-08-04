import { generateClient } from "aws-amplify/api";

export const client = generateClient();

export async function graphqlOperation(query: string, variables?: any) {
   try {
      const result = (await client.graphql({
         query,
         variables,
      })) as any;
      return result;
   } catch (err) {
      console.error("GraphQL operation failed: ", err);
      throw err;
   }
}
