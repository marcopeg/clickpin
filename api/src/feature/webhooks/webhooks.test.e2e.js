const axios = require('axios');

describe('webhooks', () => {
  const { TEST_SERVER_ROOT } = global.env;

  it('should be able to invoke the hasura webhook', async () => {
    try {
      await axios.post(`${TEST_SERVER_ROOT}/webhooks/hasura`, {});
    } catch (err) {
      expect(err.response.status).toBe(404);
      expect(err.response.data).toBe('Unhandled webhook');
    }
  });
});
