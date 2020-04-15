const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} webhooks`;
const REGISTER_WEBHOOK = `${SERVICE_NAME}/register`;

module.exports = {
  SERVICE_NAME,
  REGISTER_WEBHOOK,
};
