const cdk = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const appsync = require("aws-cdk-lib/aws-appsync");
const logs = require("aws-cdk-lib/aws-logs");

class NotesAppStack extends cdk.Stack {
  constructor(scope, id, props) {
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
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: false,
      },
      deletionProtection: false,
    });

    // Global secondary index
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
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GraphQL API
    const api = new appsync.GraphqlApi(this, "NotesApi", {
      name: "sentiment-notes-api",
      definition: appsync.Definition.fromFile("./schema/schema.graphql"),
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
      xrayEnabled: true,
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

    // Get Notes Function
    const getNotesFunction = new appsync.AppsyncFunction(
      this,
      "GetNotesFunction",
      {
        name: "getNotes",
        api,
        dataSource: notesDataSource,
        code: appsync.Code.fromAsset("./resolvers/getNotes.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    // Get Notes Resolver
    new appsync.Resolver(this, "GetNotesResolver", {
      api,
      typeName: "Query",
      fieldName: "getNotes",
      code: appsync.Code.fromAsset("./resolvers/pipeline.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [getNotesFunction],
    });

    // Create Note Function
    const createNoteFunction = new appsync.AppsyncFunction(
      this,
      "CreateNoteFunction",
      {
        name: "createNote",
        api,
        dataSource: notesDataSource,
        code: appsync.Code.fromAsset("./resolvers/createNote.js"),
        runtime: appsync.FunctionRuntime.JS_1_0_0,
      }
    );

    // Create Note Resolver
    new appsync.Resolver(this, "CreateNoteResolver", {
      api,
      typeName: "Mutation",
      fieldName: "createNote",
      code: appsync.Code.fromAsset("./resolvers/pipeline.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [createNoteFunction],
    });

    // Store outputs as properties for cross-stack reference
    this.apiUrl = api.graphqlUrl;
    this.apiKey = api.apiKey || "";

    // Outputs
    new cdk.CfnOutput(this, "GraphQLApiUrl", {
      value: api.graphqlUrl,
      description: "GraphQL API Endpoint URL",
      exportName: `${this.stackName}-GraphQLApiUrl`,
    });

    new cdk.CfnOutput(this, "GraphQLApiKey", {
      value: api.apiKey || "",
      description: "GraphQL API Key for authentication",
      exportName: `${this.stackName}-GraphQLApiKey`,
    });

    new cdk.CfnOutput(this, "Region", {
      value: this.region,
      description: "AWS Region where resources are deployed",
      exportName: `${this.stackName}-Region`,
    });

    new cdk.CfnOutput(this, "DynamoDbTableName", {
      value: notesTable.tableName,
      description: "DynamoDB Table Name for notes storage",
      exportName: `${this.stackName}-DynamoDbTableName`,
    });
  }
}

module.exports = { NotesAppStack };
