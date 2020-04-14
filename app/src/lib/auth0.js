import React, { useEffect, useRef, useState } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import history from '../history';
import env from '../environment';

export const Auth0Context = React.createContext();

const Auth0ProviderDev = ({ children }) => {
  // Attempt to parse the
  const { userId, userRole, userData, adminSecret } = (() => {
    try {
      return JSON.parse(env.AUTH0_CLIENT_ID);
    } catch (err) {
      console.error(err);
      throw new Error('Could not parse: process.env.AUTH0_CLIENT_ID');
    }
  })();

  return (
    <Auth0Context.Provider
      value={{
        // states
        isReady: true,
        isLoading: false,
        isAuthenticated: true,

        // data
        user: userData || {
          username: 'John Doe',
          email: 'jdoe@foobar.com',
        },
        token: {
          'x-hasura-admin-secret': adminSecret,
          'x-hasura-role': userRole,
          'x-hasura-user-id': userId,
        },

        // api
        login: () => {},
        logout: () => {},
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

const Auth0ProviderProd = ({
  children,
  rootURL = window.location.origin,
  rootURI = window.location.pathname,
  ...initOptions
}) => {
  const [status, setStatus] = useState({
    isAuthenticated: false,
    isLoading: true,
    isReady: false,
    error: null,
    user: null,
    token: null,
  });
  const clientRef = useRef(null);

  // Initialize the client
  useEffect(() => {
    (async () => {
      let isAuthenticated = false;
      let error = null;
      let user = null;
      let token = null;
      try {
        // Init client and check for current authentication status
        clientRef.current = await createAuth0Client(initOptions);
        isAuthenticated = await clientRef.current.isAuthenticated(false);

        // Handles callback url and hard redirects
        if (!isAuthenticated && window.location.search.includes('code=')) {
          const { appState } = await clientRef.current.handleRedirectCallback();
          isAuthenticated = await clientRef.current.isAuthenticated(false);
          history.push(appState && appState.returnTo ? appState.returnTo : '/');
        }

        // Tries to recover user's informations and token
        if (isAuthenticated) {
          const info = await Promise.all([
            clientRef.current.getUser(),
            clientRef.current.getTokenSilently(),
          ]);

          user = info[0];
          token = info[1];
        }
      } catch (err) {
        error = err.message;
      }

      setStatus({
        isAuthenticated,
        isLoading: false,
        isReady: true,
        error,
        user,
        token,
      });
    })();
  }, []); // eslint-disable-line

  const login = (
    payload = {
      appState: {
        returnTo: window.location.pathname,
      },
    },
  ) => {
    setStatus(status => ({ ...status, isLoading: true }));
    clientRef.current.loginWithRedirect(payload);
  };

  const logout = () => {
    setStatus(status => ({ ...status, isLoading: true }));
    clientRef.current.logout({ returnTo: rootURL });
  };

  const value = {
    ...status,
    login,
    logout,
  };

  return (
    <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>
  );
};

export const Auth0Provider =
  env.AUTH0_DOMAIN === '@dev' ? Auth0ProviderDev : Auth0ProviderProd;
