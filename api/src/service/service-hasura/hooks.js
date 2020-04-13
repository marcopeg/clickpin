const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} hasura`;
const HASURA_IS_READY = `${SERVICE_NAME}/isReady`;

module.exports = {
  SERVICE_NAME,
  HASURA_IS_READY,
};
