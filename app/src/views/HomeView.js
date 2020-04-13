import React from 'react';
import { useAuth0 } from '../state/auth0';

const HomeView = () => {
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
      Home view
      <br />
      {btn}
    </div>
  );
};

export default HomeView;
