const path = require('path');
const { FEATURE_NAME, ...hooks } = require('./hooks');
const { getLastMigration } = require('./get-last-migration');

const migrationsActionHandler = async ({ hasura }, { getConfig }) => {
  // Opt-in migrations from the App's configuration
  if (!getConfig('migrations.isEnable')) return;

  console.info('Running migrations...');
  const source = path.join(__dirname, 'migrations');
  const etag = await getLastMigration(hasura);
  const migrations = await hasura.loadFromDisk(source);
  await hasura.up(migrations, etag);
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);
  registerAction({
    hook: '$HASURA_IS_READY',
    name: FEATURE_NAME,
    trace: __filename,
    handler: migrationsActionHandler,
  });
};
