import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Router } from 'react-router-dom';

import env from './environment';
import history from './history';
import { Auth0Provider } from './lib/auth0';
import { ApolloProvider } from './lib/ApolloProvider';
import App from './App';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Auth0Provider
        domain={env.AUTH0_DOMAIN}
        client_id={env.AUTH0_CLIENT_ID}
        audience={env.AUTH0_AUDIENCE}
        redirect_uri={window.location.origin}
      >
        <ApolloProvider endpoint={env.HASURA_ENDPOINT}>
          <React.Fragment>
            <CssBaseline />
            <Router history={history}>
              <App />
            </Router>
          </React.Fragment>
        </ApolloProvider>
      </Auth0Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
