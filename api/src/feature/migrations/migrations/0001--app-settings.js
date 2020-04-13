const SETTINGS_CREATE = `
  CREATE TABLE public.app_settings (
    key VARCHAR(80) PRIMARY KEY,
    value JSONB default '{}'
  );
`;

const SETTINGS_DROP = `
  DROP TABLE IF EXISTS public.app_settings CASCADE;
`;

const SETTINGS_POPULATE = `
  INSERT INTO public.app_settings VALUES
  ('hasura.migrations.current', '-1')
`;

const down = async hasura => {
  await hasura.untrackTable({
    schema: 'public',
    name: 'app_settings',
    cascade: true,
  });

  await hasura.query(SETTINGS_DROP, null, { throw: false, log: 'dismantle' });
};

const up = async hasura => {
  await hasura.query(SETTINGS_CREATE, null, { throw: false, log: 'build' });

  await hasura.trackTable({
    schema: 'public',
    name: 'app_settings',
  });

  await hasura.createSelectPermission({
    role: 'user',
    table: 'app_settings',
    permission: {
      columns: '*',
      filter: {},
    },
  });

  await hasura.query(SETTINGS_POPULATE, null, { throw: false, log: 'build' });
};

module.exports = {
  stable: true,
  up,
  down,
};
