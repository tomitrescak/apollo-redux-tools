"use strict";
var config_1 = require('./config');
var mutation_1 = require('./mutation');
function default_1(_a) {
    var query = _a.query, variables = _a.variables, optimisticCallback = _a.optimisticCallback, thenCallback = _a.thenCallback, errorCallback = _a.errorCallback, catchCallback = _a.catchCallback, finalCallback = _a.finalCallback, forceFetch = _a.forceFetch, pollInterval = _a.pollInterval, returnPartialData = _a.returnPartialData;
    return function (dispatch, state) {
        if (optimisticCallback) {
            optimisticCallback(dispatch, state);
        }
        var observer = config_1.default.apolloClient.watchQuery({
            query: (_a = ["", ""], _a.raw = ["", ""], gql(_a, query)),
            variables: variables,
            forceFetch: forceFetch,
            pollInterval: pollInterval,
            returnPartialData: returnPartialData
        });
        var subscription = observer.subscribe({
            next: function (graphQLResult) {
                var errors = graphQLResult.errors, data = graphQLResult.data;
                if (data && thenCallback) {
                    thenCallback(data, dispatch, state);
                }
                if (errors && errorCallback) {
                    mutation_1.showMessage('Error', errors);
                    errorCallback(errors, dispatch, state);
                    console.error(errors);
                }
                if (finalCallback) {
                    finalCallback(dispatch, state);
                }
            },
            error: function (error) {
                mutation_1.showMessage('Error', error);
                if (catchCallback) {
                    catchCallback(error, dispatch, state);
                }
                if (error.networkError) {
                    console.error(error.networkError);
                    console.error(error.networkError.stack);
                }
                else {
                    console.error(error);
                    console.error(error.stack);
                }
                if (finalCallback) {
                    finalCallback(dispatch, state);
                }
            }
        });
        return subscription;
        var _a;
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
