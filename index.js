#!/usr/bin/env node
const axios = require('axios');

const newman = require('newman'); // require newman in your project

//TODO: For tomorrow
// Send basic challenge stats 5 mins
// Make the script accept a api_key as a param. 10 mins
// Publish an rpm 20 mins.


//TODO: Next iteration
// 0. Super quickly, 10 mins. Understand whether you can run against a remote collection.
// 1. Identify what parts of the test summary should be sent. 10 mins.
// - might need to add the test code to the results for each assertion. That way you can present the test that didn't work
// Pass in collection.info.name to identify the challenge
// 2. Update the collection file accordingly. 15 mins
// - Add description to each test. Use name as a human readable identifier, e.g. scenario-1-update-and-fetch-balance. Use it to bind the test definition coming
// from the collection part of the summary with the corresponding execution
// 3. Publish an rpm 20 mins
newman.run({
  collection: require('./api-tests.json'),
  reporters: 'cli'
}, function (err, summary) {
  let executions = summary.run.executions.map(transformExecution);

  let results = {
    stats: summary.run.stats,
    timings: summary.run.timings,
    executions: executions
  }
  axios.post('https://test-server-rho.now.sh/api/accept-results', {
    user: 'a953aa85-9fe3-4d88-a66f-397875f42bde',
    results: results
  })
    .then(function (response) {
      console.log("Here comes the response: 🏄")
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  // Use token

  console.log(JSON.stringify(results));
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