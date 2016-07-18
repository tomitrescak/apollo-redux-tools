import config from './config';
import sweetalert from 'sweetalert2';
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
            if (errors) {
                showMessage('Error', errors.map((e) => e.message).join('\n'));
                console.error(errors);
                if (errorCallback) {
                    errorCallback(errors, dispatch, state);
                }
            }
        }).catch((error) => {
            showMessage('Error', error.message ? (error.message + error.stack) : error);
            if (catchCallback) {
                catchCallback(error, dispatch, state);
            }
            console.error(error);
            console.error(error.stack);
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
