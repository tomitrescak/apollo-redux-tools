import config from './config';

declare var gql: any;


interface IMutation {
  query: string;
  variables: Object;
  optimisticCallback: (dispatch: Function, state: () => any) => void;
  thenCallback: (data: any, dispatch: Function, state: () => any) => void;
  errorCallback: (errors: any, dispatch: Function, state: () => any) => void;
  catchCallback: (error: any, dispatch: Function, state: () => any) => void;
  finalCallback: (dispatch: Function, state: () => any) => void;
}

export default function({ query, variables, optimisticCallback, thenCallback, errorCallback, catchCallback, finalCallback }: IMutation) {
  return (dispatch: Function, state: () => any): any => {
    if (optimisticCallback) {
      optimisticCallback(dispatch, state);
    }

    config.apolloClient.mutate({
      mutation: gql`${query}`,
      variables: variables
    }).then((graphQLResult: any) => {
      const { errors, data } = graphQLResult;

      if (data && thenCallback) {
        thenCallback(data, dispatch, state);
      }

      if (errors) {
        // showMessage('Error', errors.map((e: any) => e.message).join('\n'));
        console.error(errors);
        if (errorCallback) {
          errorCallback(errors, dispatch, state);
        }
      }

      if (finalCallback) {
        finalCallback(dispatch, state);
      }
    }).catch((error: any) => {
      // showMessage('Error', error.message ? (error.message + error.stack) : error);
      if (catchCallback) {
        catchCallback(error, dispatch, state);
      } else {
        console.group('Apollo Error');
        console.error(error.message);
        if (error.networkError) {
          console.error(error.networkError);
          console.error(error.networkError.stack);
        } else {
          console.error(error);
          console.error(error.stack);
        }
        console.groupEnd();
      }

      if (finalCallback) {
        finalCallback(dispatch, state);
      }
    });
    return null;
  };
}