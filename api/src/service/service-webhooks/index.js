const { SERVICE_NAME, ...hooks } = require('./hooks');

module.exports = ({ registerAction, registerHook, createHook }) => {
  registerHook(hooks);

  registerAction({
    hook: '$FASTIFY_ROUTE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ registerRoute }, { getConfig }) => {
      const root = getConfig('webhooks.root', 'webhooks');

      // Collect webhooks extensions and
      const webhooks = createHook.sync(hooks.REGISTER_WEBHOOK);
      const registered = [];

      // Register the webhooks that have been extended
      webhooks.forEach(([webhook]) => {
        // TODO: ajv the webhook data structure

        const { name, method = 'POST', ...routeConfig } = webhook;

        if (registered.includes(name)) {
          throw new Error(`[webhooks] attempt to duplicate: "${name}"`);
        }

        // TODO: add standard pre-handler that validates at
        //       least a basic password or a token, let the
        //       extension to provide a custom pre-handler
        registerRoute({
          url: `/${root}/${name}`,
          method,
          ...routeConfig,
        });

        registered.push(name);
      });
    },
  });
};
