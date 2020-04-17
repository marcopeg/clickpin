const fetch = require('cross-fetch/polyfill').fetch;
const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const createHttpLink = require('apollo-link-http').createHttpLink;
const setContext = require('apollo-link-context').setContext;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;

const createClient = ({ rootUrl, adminSecret }) => {
  const httpLink = createHttpLink({
    uri: `${rootUrl}/v1/graphql`,
    fetch: fetch,
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      'x-hasura-admin-secret': adminSecret,
    },
  }));

  return new ApolloClient({
    link: authLink.concat(httpLink),
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
};

module.exports = { createClient };
