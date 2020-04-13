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

module.exports = { getLastMigration };
