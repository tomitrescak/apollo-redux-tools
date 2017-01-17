import * as React from 'react';

const defaultComponent: React.StatelessComponent<any> =
  (props: any): any => {
    throw new Error('Please initialise default components or specify one');
  };

export interface GlobalOptions {
  loadingComponent: React.StatelessComponent<any>;
  authComponent: React.StatelessComponent<any>;
  LoggingIn: React.StatelessComponent<any>;
  apolloClient: any;
  contextTypes: Object;
  store: any;
  isLoggingIn? (context: any): boolean;
  userIdSelector? (context: any): string;
  userRolesSelector? (context: any): string[];
}

const options: GlobalOptions = {
  loadingComponent: defaultComponent,
  authComponent: defaultComponent,
  LoggingIn: defaultComponent,
  apolloClient: null,
  contextTypes: {
    state: React.PropTypes.object
  },
  store: null,
  userIdSelector: null,
  userRolesSelector: null,
  isLoggingIn: null
};

export default options;
