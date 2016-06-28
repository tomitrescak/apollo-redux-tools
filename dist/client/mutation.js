import config from './config';
import sweetalert from 'sweetalert';
export default function ({ query, variables, optimisticCallback, thenCallback, errorCallback, catchCallback }) {
    return (dispatch, state) => {
        if (optimisticCallback) {
            optimisticCallback(dispatch, state);
        }
        config.apolloClient.mutate({
            mutation: gql `${query}`,
            variables: variables
        }).then((graphQLResult) => {
            const { errors, data } = graphQLResult;
            if (data && thenCallback) {
                thenCallback(data, dispatch, state);
            }
            if (errors && errorCallback) {
                showMessage('Error', errors.map((e) => e.message));
                errorCallback(errors, dispatch, state);
                console.error(errors);
            }
        }).catch((error) => {
            showMessage('Error', error.message ? (error.message + error.stack) : error);
            if (catchCallback) {
                catchCallback(error, dispatch, state);
            }
            console.error(error);
        });
        return null;
    };
}
export function showMessage(title, text, type = 'error') {
    if (sweetalert) {
        sweetalert({ title: title, text: text, type: type, confirmButtonText: 'OK' });
    }
    else {
        alert(`${title}: ${text}`);
    }
}
