const envalid = require('envalid');

// Setup the internal connection to the backend using
// environment variables and some guesswork for
// CodeSanbox.
const BACKEND_ROOT = (() => {
  if (process.env.SERVER_ROOT) {
    return process.env.SERVER_ROOT;
  }

  // Apply default if running in localhost
  return 'http://localhost:8081';
})();

module.exports = () =>
  envalid.cleanEnv(process.env, {
    TEST_SERVER_ROOT: envalid.url({
      default: BACKEND_ROOT,
    }),
    TEST_STATUS_CHECK_URL: envalid.url({
      default: `${BACKEND_ROOT}/test/status`,
    }),
    TEST_STATUS_CHECK_INTERVAL: envalid.num({ default: 250 }),
  });
