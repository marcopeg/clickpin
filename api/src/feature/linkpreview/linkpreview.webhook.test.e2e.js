const axios = require('axios');

describe('linkpreview/webhook', () => {
  const { TEST_SERVER_ROOT } = global.env;
  let originalApiKey = null;

  // Force a development api key for linkpreview so to avoid
  // to exaust the rate limit
  beforeAll(async () => {
    originalApiKey = await global.app.getConfig('linkpreview.api.key');
    await global.app.setConfig('linkpreview.api.key', '@dev');
  });

  afterAll(() => global.app.setConfig('linkpreview.api.key', originalApiKey));

  it('should match the hasura payload for an insert into the urls table', async () => {
    const r1 = await axios.post(`${TEST_SERVER_ROOT}/webhooks/hasura`, {
      event: {
        session_variables: {
          'x-hasura-role': 'user',
          'x-hasura-user-id': '1',
        },
        op: 'INSERT',
        data: {
          old: null,
          new: {
            cover: null,
            data: {},
            url: 'http://google.com',
            updated_at: '2020-04-16T06:52:33.148316+00:00',
            created_at: '2020-04-16T06:52:33.148316+00:00',
            id: 1,
            title: null,
            description: null,
          },
        },
      },
      created_at: '2020-04-16T06:52:33.148316Z',
      id: '129864fc-a3c4-4d92-85f7-3557b2c6c2bf',
      delivery_info: {
        max_retries: 0,
        current_retry: 0,
      },
      trigger: {
        name: 'on_create_url',
      },
      table: {
        schema: 'public',
        name: 'urls',
      },
    });

    expect(r1.status).toBe(200);
    expect(r1.data).toBe('affected_rows: 1');
  });
});
