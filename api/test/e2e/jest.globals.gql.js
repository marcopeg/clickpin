const fetch = require('cross-fetch/polyfill').fetch;
const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;

const env = require('./jest.env')();

const graphqlClient = new ApolloClient({
  link: createHttpLink({
    uri: `${env.TEST_SERVER_ROOT}/graphql`,
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

const graphqlQuery = (query, variables = {}, options = {}) =>
  graphqlClient.query({
    ...options,
    query: typeof query === 'string' ? gql(query) : query,
    variables,
  });

const graphqlMutate = (mutation, variables = {}, options = {}) =>
  graphqlClient.mutate({
    ...options,
    mutation: typeof mutation === 'string' ? gql(mutation) : mutation,
    variables,
  });

module.exports = {
  query: graphqlQuery,
  mutate: graphqlMutate,
};
