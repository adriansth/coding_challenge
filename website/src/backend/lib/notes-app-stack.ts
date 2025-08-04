import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class NotesAppStack extends cdk.Stack {
   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      // DynamoDB table for storing notes
      const notesTable = new dynamodb.Table(this, "NotesTable", {
         tableName: "sentiment-notes",
         partitionKey: {
            name: "id",
            type: dynamodb.AttributeType.STRING,
         },
         sortKey: {
            name: "dateCreated",
            type: dynamodb.AttributeType.STRING,
         },
         billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // serverless pricing
         removalPolicy: cdk.RemovalPolicy.DESTROY, // for development -> change for production
         pointInTimeRecovery: false,
         deletionProtection: false,
      });
      // global secondary index for efficient sentiment-based queries
      notesTable.addGlobalSecondaryIndex({
         indexName: "SentimentIndex",
         partitionKey: {
            name: "sentiment",
            type: dynamodb.AttributeType.STRING,
         },
         sortKey: {
            name: "dateCreated",
            type: dynamodb.AttributeType.STRING,
         },
         projectionType: dynamodb.ProjectionType.ALL, // include all attributes
      });
      // GraphQL API with AppSync
      const api = new appsync.GraphqlApi(this, "NotesApi", {
         name: "sentiment-notes-api",
         definition: appsync.Definition.fromFile("./backend/schema.graphql"),
         authorizationConfig: {
            defaultAuthorization: {
               authorizationType: appsync.AuthorizationType.API_KEY,
               apiKeyConfig: {
                  name: "sentiment-notes-api-key",
                  description: "API Key for Sentiment Notes App",
                  expires: cdk.Expiration.after(cdk.Duration.days(365)),
               },
            },
         },
         xrayEnabled: true, // enable x-ray tracing for monitoring
         logConfig: {
            fieldLogLevel: appsync.FieldLogLevel.ALL,
            retention: logs.RetentionDays.ONE_WEEK,
         },
      });
      // DynamoDB data source
      const notesDataSource = api.addDynamoDbDataSource(
         "NotesDataSource",
         notesTable
      );
      // QUERY RESOLVERS
      // get notes (loading from external file)
      const getNotesFunction = new appsync.AppsyncFunction(
         this,
         "GetNotesFunction",
         {
            name: "getNotes",
            api,
            dataSource: notesDataSource,
            code: appsync.Code.fromAsset("./backend/resolvers/getNotes.js"),
         }
      );
      // resolver: connect getNotes query to function
      new appsync.Resolver(this, "GetNotesResolver", {
         api,
         typeName: "Query",
         fieldName: "getNotes",
         code: appsync.Code.fromAsset("./backend/resolvers/pipeline.js"),
         runtime: appsync.FunctionRuntime.JS_1_0_0,
         pipelineConfig: [getNotesFunction],
      });
      // MUTATION RESOLVERS
      // create note (loading from external file)
      const createNoteFunction = new appsync.AppsyncFunction(
         this,
         "CreateNoteFunction",
         {
            name: "createNote",
            api,
            dataSource: notesDataSource,
            code: appsync.Code.fromAsset("./backend/resolvers/createNote.js"),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
         }
      );
      // OUTPUTS
      new cdk.CfnOutput(this, "GraphQLApiUrl", {
         value: api.graphqlUrl,
         description: "GraphQL API Endpoint API",
         exportName: `${this.stackName}-GraphQLApiUrl`,
      });
      new cdk.CfnOutput(this, "GraphQLApiKey", {
         value: api.apiKey || "",
         description: "GraphQL API Key for authentication",
         exportName: `${this.stackName}-Region`,
      });
      new cdk.CfnOutput(this, "DynamoDBTableName", {
         value: notesTable.tableName,
         description: "DynamoDB Table Name for notes storage",
         exportName: `${this.stackName}-DynamoDBTableName`,
      });
   }
}
