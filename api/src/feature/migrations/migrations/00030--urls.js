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
  await hasura.untrackTable({
    schema: 'public',
    name: 'urls',
    cascade: true,
  });
  await hasura.query(URLS_DROP, null, { throw: false, log: 'dismantle' });
  await hasura.call({
    type: 'delete_event_trigger',
    args: {
      name: 'on_create_url',
    },
  });
};

const up = async hasura => {
  await down(hasura);

  await hasura.query(URLS_CREATE, null, { throw: false, log: 'build' });
  await hasura.trackTable({
    schema: 'public',
    name: 'urls',
  });

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

  await hasura.call({
    type: 'create_event_trigger',
    args: {
      name: 'on_create_url',
      table: {
        schema: 'public',
        name: 'urls',
      },
      webhook: 'http://localhost:8080/webhooks/hasura',
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
