import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Router } from 'react-router-dom';

import history from './history';
import { Auth0Provider } from './state/auth0';
import App from './App';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        redirect_uri={window.location.origin}
      >
        <React.Fragment>
          <CssBaseline />
          <Router history={history}>
            <App />
          </Router>
        </React.Fragment>
      </Auth0Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
