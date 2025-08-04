#!/usr/bin/env node
const cdk = require("aws-cdk-lib");
const { NotesAppStack } = require("../lib/notes-app-stack");

const app = new cdk.App();

new NotesAppStack(app, "SentimentNotesStack", {
   description: "Sentiment Notes - Coding Challenge Application",
   tags: {
      Project: "SentimentNotes",
      Environment: "Development",
   },
});

app.synth();
