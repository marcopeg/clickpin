const path = require('path');
const { FEATURE_NAME, ...hooks } = require('./hooks');

const getLastMigration = async hasura => {
  try {
    const lastMigration = await hasura.query({
      sql: 'SELECT * FROM app_settings WHERE key = $key',
      binds: { key: 'hasura.migrations.current' },
    });

    return lastMigration.length ? Number(lastMigration[0].value) : -1;
  } catch (err) {
    return -1;
  }
};

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
