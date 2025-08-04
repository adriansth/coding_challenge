// src/lib/aws-config.ts
import { Amplify } from "aws-amplify";

let isConfigured = false;

export const configureAmplify = () => {
   // prevent multiple configurations
   if (isConfigured) {
      console.log("✅ Amplify already configured, skipping...");
      return;
   }

   // only run on client side
   if (typeof window === "undefined") {
      console.log("🚫 Server side detected, skipping Amplify config");
      return;
   }

   console.log("🔍 === AWS CONFIG DEBUG START ===");
   console.log("Environment:", process.env.NODE_ENV);

   // DEBUG: Check ALL environment variables
   console.log("All NEXT_PUBLIC variables:");
   Object.keys(process.env)
      .filter((key) => key.startsWith("NEXT_PUBLIC_"))
      .forEach((key) => {
         console.log(`${key}:`, process.env[key] ? "SET ✅" : "MISSING ❌");
      });

   // specific checks
   console.log("\n📊 Specific Variable Check:");
   console.log(
      "NEXT_PUBLIC_AWS_REGION:",
      process.env.NEXT_PUBLIC_AWS_REGION || "UNDEFINED ❌"
   );
   console.log(
      "NEXT_PUBLIC_GRAPHQL_ENDPOINT:",
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "UNDEFINED ❌"
   );
   console.log(
      "NEXT_PUBLIC_API_KEY:",
      process.env.NEXT_PUBLIC_API_KEY ? "SET ✅" : "UNDEFINED ❌"
   );

   // validate env variables
   const validateEnvVars = () => {
      const requiredVars = {
         region: process.env.NEXT_PUBLIC_AWS_REGION,
         graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
         apiKey: process.env.NEXT_PUBLIC_API_KEY,
      };

      const missing = Object.entries(requiredVars)
         .filter(([key, value]) => !value)
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

      console.log("✅ All environment variables validated successfully");
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

      console.log("🔧 Final AWS Config Object:", awsconfig);

      // configure Amplify
      Amplify.configure(awsconfig);
      isConfigured = true;

      console.log("✅ Amplify configured successfully!");
      console.log("🔍 === AWS CONFIG DEBUG END ===\n");
   } catch (error) {
      console.error("❌ AWS Configuration failed:", error);
      throw error;
   }
};

// auto-configure if on client side
if (typeof window !== "undefined") {
   configureAmplify();
}
