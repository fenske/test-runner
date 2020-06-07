#!/usr/bin/env node
const axios = require('axios');

const newman = require('newman'); // require newman in your project

const core = require('@actions/core');
const github = require('@actions/github');

//TODO: Next iteration
// 0. Super quickly, 10 mins. Understand whether you can run against a remote collection.
// 1. Identify what parts of the test summary should be sent. 10 mins.
// - might need to add the test code to the results for each assertion. That way you can present the test that didn't work
// Pass in collection.info.name to identify the challenge
// 2. Update the collection file accordingly. 15 mins
// - Add description to each test. Use name as a human readable identifier, e.g. scenario-1-update-and-fetch-balance. Use it to bind the test definition coming
// from the collection part of the summary with the corresponding execution
// 3. Publish an rpm 20 mins

try {
  // `who-to-greet` input defined in action metadata file
  let userId = core.getInput('access-key');

  newman.run({
    collection: require('./api-tests.json'),
    reporters: 'cli'
  }, function (err, summary) {
    let executions = summary.run.executions.map(transformExecution);

    let results = {
      assertions: summary.run.stats.assertions,
    }

    axios.post('https://test-server-git-firestore.fenskexyz.now.sh/api/accept-results', {
      user: userId,
      challenge: summary.collection.name,
      results: results
    })
      .then(function (response) {
      })
      .catch(function (error) {
      });

    core.setOutput("summary", summary);
  });

  core.setOutput("summary", "");
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

function transformExecution(exec) {
  return {
    item: {
      name: exec.item.name,
      event: exec.item.event
    },
    request: exec.request,
    response: exec.response,
    assertions: exec.assertions
  }
}