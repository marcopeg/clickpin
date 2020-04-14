// Gather environment variables
const env = {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_HASURA_ENDPOINT: process.env.REACT_APP_HASURA_ENDPOINT,
  REACT_APP_AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_AUDIENCE: process.env.REACT_APP_AUTH0_AUDIENCE,
};

// Setup fake Hasura credentials for development
if (env.NODE_ENV === 'development' && !env.REACT_APP_AUTH0_DOMAIN) {
  const adminSecret = process.env.REACT_APP_HASURA_SECRET || 'hasura';
  const defaultUser = `{"userId": "1", "userRole":"user", "adminSecret":"${adminSecret}"}`;
  env.REACT_APP_AUTH0_DOMAIN = '@dev';
  env.REACT_APP_AUTH0_CLIENT_ID = env.REACT_APP_AUTH0_CLIENT_ID || defaultUser;
}

const requiredKeys = [
  'REACT_APP_HASURA_ENDPOINT',
  'REACT_APP_AUTH0_DOMAIN',
  'REACT_APP_AUTH0_CLIENT_ID',
];

// Ensure environment variables
const missingKeys = requiredKeys.filter(key => !env[key]);
if (missingKeys.length) {
  throw new Error(
    `Missing environment variables: \n- ${missingKeys.join('\n- ')}`,
  );
}

const validEnv = {
  HASURA_ENDPOINT: env.REACT_APP_HASURA_ENDPOINT,
  AUTH0_DOMAIN: env.REACT_APP_AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: env.REACT_APP_AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE:
    env.REACT_APP_AUTH0_AUDIENCE ||
    `https://${env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
};

console.log('@@ENV:', validEnv);

export default validEnv;
