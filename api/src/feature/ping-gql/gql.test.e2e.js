const axios = require('axios');

describe('ping/gql', () => {
  const { TEST_SERVER_ROOT } = global.env;

  it('should ping on graphql', async () => {
    const r1 = await global.graphql.query(`query { ping { message } }`);
    expect(r1.data.ping.message).toBe('+ok');
  });
});
