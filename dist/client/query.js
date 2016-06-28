import config from './config';
import { showMessage } from './mutation';
export default function ({ query, variables, optimisticCallback, thenCallback, errorCallback, catchCallback }) {
    return (dispatch, state) => {
        if (optimisticCallback) {
            optimisticCallback(dispatch, state);
        }
        config.apolloClient.query({
            query: gql `${query}`,
            variables: variables
        }).then((graphQLResult) => {
            const { errors, data } = graphQLResult;
            if (data && thenCallback) {
                thenCallback(data, dispatch, state);
            }
            if (errors && errorCallback) {
                showMessage('Error', errors);
                errorCallback(errors, dispatch, state);
                console.error(errors);
            }
        }).catch((error) => {
            showMessage('Error', error);
            if (catchCallback) {
                catchCallback(error, dispatch, state);
            }
            console.error(error);
        });
        return null;
    };
}
