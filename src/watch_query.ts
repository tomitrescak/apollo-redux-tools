import config from './config';
declare var gql: any;

interface IWatchQuery {
  query: string;
  variables: Object;
  pollInterval: number;
  returnPartialData: boolean;
  forceFetch: boolean;
  optimisticCallback: (dispatch: Function, state: () => any) => void;
  thenCallback: (data: any, dispatch: Function, state: () => any) => void;
  errorCallback: (errors: any, dispatch: Function, state: () => any) => void;
  catchCallback: (error: any, dispatch: Function, state: () => any) => void;
  finalCallback: (dispatch: Function, state: () => any) => void;
}

interface ISubscription {
  refetch(vas: Object): void;
  unsubscribe(): void;
  stopPolling(): void;
  startPolling(pollInterval: number): void;
}

export default function ({ query, variables, optimisticCallback, thenCallback, errorCallback, catchCallback, finalCallback, forceFetch, pollInterval, returnPartialData }: IWatchQuery) {
  return (dispatch: Function, state: () => any): ISubscription => {
    if (optimisticCallback) {
      optimisticCallback(dispatch, state);
    }

    const observer = config.apolloClient.watchQuery({
      query: gql`${query}`,
      variables: variables,
      forceFetch,
      pollInterval,
      returnPartialData
    });

    const subscription = observer.subscribe({
      next: (graphQLResult: any) => {
        const { errors, data } = graphQLResult;

        if (data && thenCallback) {
          thenCallback(data, dispatch, state);
        }

        if (errors && errorCallback) {
          // showMessage('Error', errors);
          errorCallback(errors, dispatch, state);
          console.error(errors);
        }

        if (finalCallback) {
          finalCallback(dispatch, state);
        }
      },
      error: (error: any) => {
        // showMessage('Error', error);
        if (catchCallback) {
          catchCallback(error, dispatch, state);
        }

        if (error.networkError) {
          console.error(error.networkError);
          console.error(error.networkError.stack);
        } else {
          console.error(error);
          console.error(error.stack);
        }

        if (finalCallback) {
          finalCallback(dispatch, state);
        }
      }
    });
    return subscription;
  };
}
