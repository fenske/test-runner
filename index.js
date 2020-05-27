#!/usr/bin/env node
const axios = require('axios');

const newman = require('newman'); // require newman in your project

//TODO: Next iteration
// 0. Super quickly, 10 mins. Understand whether you can run against a remote collection.
// 1. Identify what parts of the test summary should be sent. 10 mins.
// - might need to add the test code to the results for each assertion. That way you can present the test that didn't work
// Pass in collection.info.name to identify the challenge
// 2. Update the collection file accordingly. 15 mins
// - Add description to each test. Use name as a human readable identifier, e.g. scenario-1-update-and-fetch-balance. Use it to bind the test definition coming
// from the collection part of the summary with the corresponding execution
// 3. Publish an rpm 20 mins

let userId = process.argv[2];

newman.run({
  collection: require('./api-tests.json'),
  reporters: 'cli'
}, function (err, summary) {
  let executions = summary.run.executions.map(transformExecution);

  let results = {
    assertions: summary.run.stats.assertions,
  }
  axios.post('https://test-server-rho.now.sh/api/accept-results', {
    user: userId,
    results: results
  })
    .then(function (response) {
    })
    .catch(function (error) {
    });
});

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