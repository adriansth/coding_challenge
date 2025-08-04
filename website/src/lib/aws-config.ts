import { Amplify } from "aws-amplify";

// validate env variables
const validateEnvVars = () => {
   const requiredVars = {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
   };
   const missing = Object.entries(requiredVars)
      .filter(([key, value]) => !value)
      .map(([key]) => `NEXT_PUBLIC_${key.toUpperCase()}`);
   if (missing.length > 0) {
      throw new Error(
         `Missing required environment variables: ${missing.join(", ")}\n` +
            "Please check your .env.local file"
      );
   }
   return requiredVars;
};

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

export default awsconfig;
