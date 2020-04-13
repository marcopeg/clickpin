import React, { useContext, useEffect, useRef, useState } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import history from '../history';

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({
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
  });
  const clientRef = useRef(null);

  // Initialize the client
  useEffect(() => {
    (async () => {
      let isAuthenticated = false;
      let error = null;      
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
      } catch (err) {
        error = err.message;
      }

      setStatus({
        isAuthenticated,
        isLoading: false,
        isReady: true,
        error,
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
