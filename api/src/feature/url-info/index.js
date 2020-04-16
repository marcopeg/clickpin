const { FEATURE_NAME } = require('./hooks');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$ON_HASURA_WEBHOOK',
    name: FEATURE_NAME,
    trace: __filename,
    handler: () => ({
      match: request => request.body.trigger.name === 'on_create_url',
      handler: (request, reply) => {
        console.log('handle urls webhoos');
        reply.send('foo');
      },
    }),
  });
};
