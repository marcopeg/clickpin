const hasura = require('hasura-sdk');
const { SERVICE_NAME, ...hooks } = require('./hooks');
const { createClient } = require('./apollo');

const pause = (delay = 0) => new Promise(r => setTimeout(r, delay));

const initActionHandler = ({ getConfig, setContext }) => {
  const { rootUrl, adminSecret } = getConfig('hasura');
  hasura.init({
    endpoint: `${rootUrl}/v1/query`,
    adminSecret,
  });

  setContext('hasura.sdk.client', hasura);
  setContext('hasura.apollo.client', createClient({ rootUrl, adminSecret }));
};

const startActionHandler = async ({ getConfig, createHook }) => {
  const sql = 'SELECT NOW()';
  const maxAttempts = getConfig('hasura.bootMaxAttempt');
  const delay = getConfig('hasura.bootDelay');

  const loop = async () => {
    try {
      await hasura.query({ sql });
      return true;
    } catch (err) {
      return false;
    }
  };

  console.info('Hasura Engine check...');
  let attempts = 0;
  let result = await loop();
  while (result !== true && attempts < maxAttempts) {
    await pause(delay);
    result = await loop();
    console.info('> attempt n.', attempts + 1, result);
    attempts++;
  }

  // Let features integrate with the service
  await createHook.serie(hooks.HASURA_IS_READY, { hasura });
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);

  registerAction({
    hook: '$INIT_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: initActionHandler,
  });

  registerAction({
    hook: '$START_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: startActionHandler,
  });
};
