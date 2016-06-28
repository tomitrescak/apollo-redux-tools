import config from './config';
import sweetalert from 'sweetalert';

declare var gql: any;


interface IMutation {
  query: string;
  variables: Object;
  optimisticCallback: (dispatch: Function, state: () => any) => void;
  thenCallback: (data: any, dispatch: Function, state: () => any) => void;
  errorCallback: (errors: any, dispatch: Function, state: () => any) => void;
  catchCallback: (error: any, dispatch: Function, state: () => any) => void;
}

export default function({ query, variables, optimisticCallback, thenCallback, errorCallback, catchCallback }: IMutation) {
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

      if (errors && errorCallback) {
        showMessage('Error', errors.map((e: any) => e.message));
        errorCallback(errors, dispatch, state);
        console.error(errors);
      }
    }).catch((error: any) => {
      showMessage('Error', error.message ? (error.message + error.stack) : error);
      if (catchCallback) {
        catchCallback(error, dispatch, state);
      }
      console.error(error);
    });
    return null;
  };
}

export function showMessage(title: string, text: string, type = 'error') {
  if (sweetalert) {
    sweetalert({title: title, text: text, type: type, confirmButtonText: 'OK' });
  } else {
    alert(`${title}: ${text}`);
  }
}
