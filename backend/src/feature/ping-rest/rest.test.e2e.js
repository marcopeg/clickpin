const axios = require('axios');

describe('ping/rest', () => {
  const { TEST_SERVER_ROOT } = global.env;

  it('should ping on rest', async () => {
    const r1 = await axios.get(`${TEST_SERVER_ROOT}/ping`);
    expect(r1.data.success).toBe(true);
    expect(r1.data.message).toBe('+ok');
  });
});
