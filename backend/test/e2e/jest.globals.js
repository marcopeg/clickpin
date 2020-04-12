const axios = require('axios');
const utils = require('./jest.globals.utils');
const app = require('./jest.globals.app');
const graphql = require('./jest.globals.gql');
const fetchq = require('./jest.globals.fetchq');
const env = require('./jest.env')();

module.exports = () => ({
  ...utils,
  env,
  app,
  graphql,
  fetchq,
});
