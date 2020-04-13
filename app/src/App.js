import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import LogoutView from './views/LogoutView';
import CallbackView from './views/CallbackView';

const App = () => {
  return (
    <div className="App">
      <h1>Wallie</h1>
      <Switch>
        <Route path="/" exact component={HomeView} />
        <Route path="/auth/login" exact component={LoginView} />
        <Route path="/auth/logout" exact component={LogoutView} />
        <Route path="/auth/callback" exact component={CallbackView} />
      </Switch>
    </div>
  );
};

export default App;
