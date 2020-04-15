const { FEATURE_NAME } = require('./hooks');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$REGISTER_WEBHOOK',
    name: FEATURE_NAME,
    trace: __filename,
    handler: () => ({
      name: 'hasura',
      handler: (request, reply) => {
        console.log('HANDLE HASURA WEBHOOK');
        console.log(request.body);
        reply.send('+ok');
      },
    }),
  });
};
