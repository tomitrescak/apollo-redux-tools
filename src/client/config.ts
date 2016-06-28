import * as React from 'react';

const defaultLoading: React.StatelessComponent<any> =
  (props: any): any => {
    throw new Error('Please initialise default loading components or specify one');
  };

export default {
  context: null,
  loadingComponent: defaultLoading,
  apolloClient: null
};
