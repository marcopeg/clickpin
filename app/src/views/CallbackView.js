import React from 'react';
import { useAuth0 } from '../state/auth0';

const CallbackView = () => {
  const auth = useAuth0();

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
    </div>
  );
};

export default CallbackView;
