// Gather environment variables
const env = {
  REACT_APP_HASURA_ENDPOINT: process.env.REACT_APP_HASURA_ENDPOINT,
  REACT_APP_AUTH0_DOMAIN: process.env.REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_CLIENT_ID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_AUDIENCE: process.env.REACT_APP_AUTH0_AUDIENCE,
};

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

export default {
  HASURA_ENDPOINT: env.REACT_APP_HASURA_ENDPOINT,
  AUTH0_DOMAIN: env.REACT_APP_AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: env.REACT_APP_AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE:
    env.REACT_APP_AUTH0_AUDIENCE ||
    `https://${env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
};
