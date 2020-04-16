const { FEATURE } = require('@forrestjs/hooks');

const FEATURE_NAME = `${FEATURE} webhooks`;
const ON_HASURA_WEBHOOK = `${FEATURE_NAME}/hasura`;

module.exports = { FEATURE_NAME, ON_HASURA_WEBHOOK };
