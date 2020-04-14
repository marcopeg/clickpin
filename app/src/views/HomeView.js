import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../state/use-auth';
import Username from '../containers/Username';

const HomeView = () => {
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
      Home view
      <br />
      {btn}
      <hr />
      {auth.isAuthenticated && (
        <div>
          <h2>{auth.user.name}</h2>
          <img src={auth.user.picture} alt={auth.user.name} />
          {console.log(auth.user)}
          <Username />
        </div>
      )}
      <hr />
      <Link to="/auth/callback">Go to callback</Link>
    </div>
  );
};

export default HomeView;
