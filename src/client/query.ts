import config from './config';
import sweetalert from 'sweetalert2';
import { showMessage } from './mutation';
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

    config.apolloClient.query({
      query: gql`${query}`,
      variables: variables
    }).then((graphQLResult: any) => {
      const { errors, data } = graphQLResult;

      if (data && thenCallback) {
        thenCallback(data, dispatch, state);
      }

      if (errors && errorCallback) {
        showMessage('Error', errors);
        errorCallback(errors, dispatch, state);
        console.error(errors);
      }

      if (finalCallback) {
        finalCallback(dispatch, state);
      }
    }).catch((error: any) => {
      showMessage('Error', error);
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
    });
    return null;
  };
}
