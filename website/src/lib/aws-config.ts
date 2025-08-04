// src/lib/aws-config.ts
import { Amplify } from "aws-amplify";

let isConfigured = false;

export const configureAmplify = () => {
   // only run on client side
   if (typeof window === "undefined") {
      console.log("🚫 Server side detected, skipping Amplify config");
      return;
   }

   // validate env variables
   const validateEnvVars = () => {
      const requiredVars = {
         region: process.env.NEXT_PUBLIC_AWS_REGION,
         graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
         apiKey: process.env.NEXT_PUBLIC_API_KEY,
      };

      const missing = Object.entries(requiredVars)
         .filter(([_, value]) => !value)
         .map(
            ([key]) =>
               `NEXT_PUBLIC_${key
                  .toUpperCase()
                  .replace("REGION", "AWS_REGION")
                  .replace("GRAPHQLENDPOINT", "GRAPHQL_ENDPOINT")
                  .replace("APIKEY", "API_KEY")}`
         );

      if (missing.length > 0) {
         console.error("❌ Missing environment variables:", missing);
         throw new Error(
            `Missing required environment variables: ${missing.join(", ")}\n` +
               "Please check your .env.local file in the project root"
         );
      }

      return requiredVars;
   };

   try {
      const env = validateEnvVars();

      const awsconfig = {
         aws_project_region: env.region,
         aws_appsync_graphqlEndpoint: env.graphqlEndpoint,
         aws_appsync_region: env.region,
         aws_appsync_authenticationType: "API_KEY" as const,
         aws_appsync_apiKey: env.apiKey,
      };

      // configure Amplify
      Amplify.configure(awsconfig);
      isConfigured = true;
   } catch (error) {
      console.error("❌ AWS Configuration failed:", error);
      throw error;
   }
};

// auto-configure if on client side
if (typeof window !== "undefined") {
   configureAmplify();
}
