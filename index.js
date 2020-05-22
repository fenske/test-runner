#!/usr/bin/env node
const axios = require('axios');

const newman = require('newman'); // require newman in your project

// call newman.run to pass `options` object and wait for callback
newman.run({
  collection: require('./api-tests.json'),
  reporters: 'cli'
}, function (err, summary) {
  let executions = summary.run.executions.map(transformExecution);

  let result = {
    stats: summary.run.stats,
    timings: summary.run.timings,
    executions: executions
  }
  axios.post('http://localhost:3000/api/segment', {
    user: 'd953aa85-9fe3-4d88-a66f-397875f42bde',
    results: result
  })
    .then(function (response) {
      console.log("Here comes the response: 🏄")
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  // Use token

  console.log(JSON.stringify(result));
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