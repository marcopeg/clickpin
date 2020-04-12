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

const path = require('path');

const settings = ({ setConfig, getConfig }) => {
  // TODO: add envalid

  // Heroku compatible port environment variable
  setConfig(
    'fastify.port',
    process.env.FASTIFY_PORT || process.env.PORT || '8081',
  );

  setConfig('fastify.instance.options', {
    logger: false,
    ignoreTrailingSlash: true,
  });

  // Generica app configuration
  setConfig('app.name', 'Clickpin API');
};

module.exports = { settings };
