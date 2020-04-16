const axios = require('axios');

describe('webhooks', () => {
  const { TEST_SERVER_ROOT } = global.env;

  it('should be able to invoke the hasura webhook', async () => {
    const r1 = await axios.post(`${TEST_SERVER_ROOT}/webhooks/hasura`, {});
    expect(r1.status).toBe(200);
  });
});
