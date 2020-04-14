import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export const USER_INFO = gql`
  query userInfo {
    accounts {
      email
    }
  }
`;

const Username = () => {
  const { loading, data } = useQuery(USER_INFO, { pollInterval: 5000 });
  return <div>{loading ? 'loading...' : data.accounts[0].email}</div>;
};

export default Username;
