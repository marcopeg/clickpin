import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

export const createApolloClient = ({ endpoint, token }) => {
  console.log('@@ Create new ApolloClient');
  const httpBaseUrl = endpoint;
  const wsBaseUrl = httpBaseUrl
    .replace('https://', 'wss://')
    .replace('http://', 'ws://');

  // #2 in development mode "token" will contain "x-hasura-" headers
  //    that gain login to a test user without Auth0 being involved.
  const headers =
    typeof token === 'object'
      ? token
      : { authorization: token ? `Bearer ${token}` : '' };

  const cache = new InMemoryCache();

  // Create an http link:
  const httpLink = new HttpLink({
    uri: `${httpBaseUrl}/v1/graphql`,
    headers,
  });

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: `${wsBaseUrl}/v1/graphql`,
    options: {
      reconnect: true,
      connectionParams: { headers },
    },
  });

  // split links based on operation type
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    link,
    cache,
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
