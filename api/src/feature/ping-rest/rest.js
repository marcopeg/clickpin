const { FEATURE_NAME } = require('./hooks');

const pingRouteHandler = async () => ({
  success: true,
  message: '+ok',
  emotion: '💩',
});

const pingRoute = {
  method: 'GET',
  url: '/ping',
  handler: pingRouteHandler,
};

const pingActionHandler = ({ registerRoute }) => registerRoute(pingRoute);

module.exports = {
  hook: '$FASTIFY_ROUTE',
  name: FEATURE_NAME,
  handler: pingActionHandler,
};
