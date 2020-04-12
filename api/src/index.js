const { runHookApp } = require('@forrestjs/hooks');

/**
 * Services
 */
const serviceFastify = require('./service/service-fastify');
const serviceFastifyGql = require('./service/service-fastify-gql');
const serviceTdd = require('./service/service-tdd');

/**
 * Features
 */
const { settings } = require('./settings');
const featurePingRest = require('./feature/ping-rest');
const featurePingGql = require('./feature/ping-gql');

/**
 * Feature Flags
 */

runHookApp({
  settings,
  trace: 'compact',
  services: [serviceFastify, serviceFastifyGql, serviceTdd],
  features: [featurePingRest, featurePingGql],
}).catch(err => console.error(err.message));

// Let Docker exit on Ctrl+C
process.on('SIGINT', () => process.exit());
