const nextConfig = {
   output: "export",
   images: {
      unoptimized: true,
   },
   trailingSlash: true,
   env: {
      NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
   },
};

module.exports = nextConfig;
