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
      <hr />
      {auth.isAuthenticated && (
        <div>
          <h2>{auth.user.name}</h2>
          <img src={auth.user.picture} />
          {console.log(auth.user)}
        </div>
      )}
    </div>
  );
};

export default HomeView;
