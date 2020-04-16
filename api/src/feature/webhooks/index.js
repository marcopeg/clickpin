const { deepLog } = require('@marcopeg/deeplog');
const { FEATURE_NAME, ...hooks } = require('./hooks');

module.exports = ({ registerAction, registerHook, createHook }) => {
  registerHook(hooks);

  registerAction({
    hook: '$REGISTER_WEBHOOK',
    name: FEATURE_NAME,
    trace: __filename,
    handler: () => ({
      name: 'hasura',
      handler: (request, reply) => {
        const extensions = createHook
          .sync(hooks.ON_HASURA_WEBHOOK)
          .map($ => $[0]);

        const target = extensions.find(({ match }) => {
          try {
            return match(request);
          } catch (err) {
            return false;
          }
        });

        if (!target) {
          reply.code(404).send('Unhandled webhook');
          return;
        }

        try {
          return target.handler(request, reply);
        } catch (err) {
          console.error(err);
          reply.code(404).send('Missbehaving handler');
        }
      },
    }),
  });
};
