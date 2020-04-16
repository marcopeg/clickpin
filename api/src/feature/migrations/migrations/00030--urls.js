const URLS_CREATE = `
  CREATE TABLE public.urls (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    cover TEXT,
    title TEXT,
    description TEXT,
    data JSONB default '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
  );
`;

const URLS_DROP = `
  DROP TABLE IF EXISTS public.urls CASCADE;
`;

const down = async hasura => {
  // Remove urls table
  await hasura.untrackTable({
    schema: 'public',
    name: 'urls',
    cascade: true,
  });
  await hasura.query(URLS_DROP, null, { throw: false, log: 'dismantle' });

  // Remove triggers
  await hasura.call({
    type: 'delete_event_trigger',
    args: {
      name: 'on_create_url',
    },
  });
};

const up = async hasura => {
  await down(hasura);

  // Build urls table & track
  await hasura.query(URLS_CREATE, null, { throw: false, log: 'build' });
  await hasura.trackTable({
    schema: 'public',
    name: 'urls',
  });

  // Setup permissions
  await hasura.call({
    type: 'create_insert_permission',
    args: {
      table: 'urls',
      role: 'user',
      permission: {
        check: {
          _exists: {
            _table: { schema: 'public', name: 'accounts' },
            _where: { id: { _eq: 'X-Hasura-User-Id' } },
          },
        },
        columns: ['url'],
      },
    },
  });
  await hasura.call({
    type: 'create_select_permission',
    args: {
      table: 'urls',
      role: 'user',
      permission: {
        filter: {
          _exists: {
            _table: { schema: 'public', name: 'accounts' },
            _where: { id: { _eq: 'X-Hasura-User-Id' } },
          },
        },
        columns: '*',
      },
    },
  });

  // Add event triggers
  await hasura.call({
    type: 'create_event_trigger',
    args: {
      name: 'on_create_url',
      table: {
        schema: 'public',
        name: 'urls',
      },
      webhook_from_env: 'HASURA_INGEST_WEBHOOK',
      insert: {
        columns: '*',
        payload: '*',
      },
    },
  });
};

module.exports = {
  stable: false,
  up,
  down,
};
