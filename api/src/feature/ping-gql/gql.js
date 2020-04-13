const { gql } = require('apollo-server-fastify');
const { FEATURE_NAME } = require('./hooks');

const pingActionHandler = () => {
  const typeDefs = gql`
    type Ping {
      message: String
      emotion: String
    }

    extend type Query {
      ping: Ping!
    }
  `;

  const resolvers = {
    Query: {
      ping: () => ({
        message: '+ok',
        emotion: '💩',
      }),
    },
  };

  // registerSchema(typeDefs, resolvers);
  return { typeDefs, resolvers };
};

module.exports = {
  hook: '$FASTIFY_GQL_EXTEND_SCHEMA',
  name: FEATURE_NAME,
  trace: __filename,
  handler: pingActionHandler,
};
