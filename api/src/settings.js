/**
 * App's Settings Configuration
 * ============================
 *
 * This function gets executed at boot time and should provide a comprehensive
 * set of all the needed configuration.
 *
 * It should eagerly crash and apply static checks to any environment configuration
 * that should be provided at boot time.
 */

const envalid = require('envalid');

const settings = ({ setConfig, getConfig }) => {
  // Validate environment and apply default values
  const env = envalid.cleanEnv(process.env, {
    NODE_ENV: envalid.str({
      choices: ['production', 'development', 'test'],
    }),
    NODE_ROLE: envalid.str({
      choices: ['master', 'worker'],
    }),
    LOG_LEVEL: envalid.str({
      default: 'info',
      choices: ['error', 'info', 'verbose', 'debug'],
    }),

    // Hasura Engine
    HASURA_API_ENDPOINT: envalid.url({ default: 'http://localhost:8080' }),
    HASURA_GRAPHQL_ADMIN_SECRET: envalid.str(),
    HASURA_BOOT_MAX_ATTEMPTS: envalid.num({ default: 10 }),
    HASURA_BOOT_DELAY: envalid.num({ default: 2500 }),
  });

  // Add validated environment to the app's configuration
  setConfig('env', env);

  // Setup Fastify's config
  setConfig('fastify.instance.options', {
    logger: false,
    ignoreTrailingSlash: true,
  });

  // Heroku compatible port environment variable
  setConfig(
    'fastify.port',
    process.env.FASTIFY_PORT || process.env.PORT || '8081',
  );

  // Setup Hasura's config
  setConfig('hasura', {
    rootUrl: env.HASURA_API_ENDPOINT,
    adminSecret: env.HASURA_GRAPHQL_ADMIN_SECRET,
    bootMaxAttempt: env.HASURA_BOOT_MAX_ATTEMPTS,
    bootDelay: env.HASURA_BOOT_DELAY,
  });

  // Setup Migrations
  // TODO: should depend upon an environment
  setConfig('migrations.isEnable', true);

  // Generic app configuration
  setConfig('app.name', 'Clickpin API');
};

module.exports = { settings };
