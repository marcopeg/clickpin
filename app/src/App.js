import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className="App">
      Hello World
      <Router>
        <Switch>
          <Route path="/" exact component={() => ' - Home'} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
