import { useContext } from 'react';
import { Auth0Context } from '../lib/auth0';
export const useAuth = () => useContext(Auth0Context);
