import React from 'react';
import { ApolloProvider as OriginalApolloProvider } from '@apollo/react-hooks';
import { useAuth } from '../state/use-auth';
import { createApolloClient } from './apollo-client';

export const ApolloProvider = ({ endpoint, children }) => {
  const { token } = useAuth();

  return (
    <OriginalApolloProvider client={createApolloClient({ endpoint, token })}>
      {children}
    </OriginalApolloProvider>
  );
};
