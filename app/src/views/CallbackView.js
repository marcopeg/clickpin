import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../state/use-auth';

const CallbackView = () => {
  const auth = useAuth();

  if (!auth.isReady) {
    return 'Awaiting auth...';
  }

  const btn = auth.isAuthenticated ? (
    <button onClick={() => auth.logout()}>Logout</button>
  ) : (
    <button onClick={() => auth.login()}>Login</button>
  );

  return (
    <div>
      CallbackView
      <br />
      {btn}
      <hr />
      <Link to="/">Home</Link>
    </div>
  );
};

export default CallbackView;
