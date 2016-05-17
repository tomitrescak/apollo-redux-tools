import * as React from 'react';
import { ApolloProvider } from 'react-apollo';

import { apolloClient } from './apollo';
import { mantraRedux } from './redux';

const Root = ({ children }: any) => (
  <ApolloProvider client={apolloClient} store={mantraRedux.store}>
    { children }
  </ApolloProvider>
);

export default Root;
