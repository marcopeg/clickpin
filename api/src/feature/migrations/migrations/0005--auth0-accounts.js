const ACCOUNTS_CREATE = `
  CREATE TABLE public.accounts (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    auth0_id VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOL NOT NULL DEFAULT true,
    is_confirmed BOOL NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    data JSONB NOT NULL DEFAULT '{}'
  );
`;

const ACCOUNTS_DROP = `
  DROP TABLE IF EXISTS public.accounts CASCADE;
`;

const ACCOUNTS_POPULATE = `
  INSERT INTO public.accounts 
  (id, email, auth0_id)
  VALUES
  (1, 'dev@wallie.com', 'dev::dev')
`;

const down = async hasura => {
  console.log('DOWN ----------------------------------->');
  await hasura.untrackTable({
    schema: 'public',
    name: 'accounts',
    cascade: true,
  });

  await hasura.query(ACCOUNTS_DROP, null, { throw: false, log: 'dismantle' });
  await hasura.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`);
};

const up = async hasura => {
  await down(hasura);
  console.log('  UP ----------------------------------->');
  await hasura.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await hasura.query(ACCOUNTS_CREATE, null, { throw: false, log: 'build' });

  await hasura.trackTable({
    schema: 'public',
    name: 'accounts',
  });

  await hasura.createSelectPermission({
    role: 'user',
    table: 'accounts',
    permission: {
      columns: [
        'id',
        'uuid',
        'email',
        'is_active',
        'is_confirmed',
        'data',
        'created_at',
        'updated_at',
      ],
      filter: { id: { _eq: 'X-Hasura-User-Id' } },
    },
  });

  await hasura.query(ACCOUNTS_POPULATE, null, { throw: false, log: 'build' });
};

module.exports = {
  stable: false,
  up,
  down,
};
