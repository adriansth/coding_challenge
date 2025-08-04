#!/usr/bin/env node
const cdk = require("aws-cdk-lib");
const { NotesAppStack } = require("../lib/notes-app-stack");

const app = new cdk.App();

// Deploy the backend stack first
new NotesAppStack(app, "SentimentNotesStack", {
  description: "Sentiment Notes - Backend API Stack",
  tags: {
    Project: "SentimentNotes",
    Environment: "Development",
  },
});

app.synth();
