"use strict";
var config_1 = require('./config');
var mutation_1 = require('./mutation');
function default_1(_a) {
    var query = _a.query, variables = _a.variables, optimisticCallback = _a.optimisticCallback, thenCallback = _a.thenCallback, errorCallback = _a.errorCallback, catchCallback = _a.catchCallback;
    return function (dispatch, state) {
        if (optimisticCallback) {
            optimisticCallback(dispatch, state);
        }
        config_1.default.apolloClient.query({
            query: (_a = ["", ""], _a.raw = ["", ""], gql(_a, query)),
            variables: variables
        }).then(function (graphQLResult) {
            var errors = graphQLResult.errors, data = graphQLResult.data;
            if (data && thenCallback) {
                thenCallback(data, dispatch, state);
            }
            if (errors && errorCallback) {
                mutation_1.showMessage('Error', errors);
                errorCallback(errors, dispatch, state);
                console.error(errors);
            }
        }).catch(function (error) {
            mutation_1.showMessage('Error', error);
            if (catchCallback) {
                catchCallback(error, dispatch, state);
            }
            console.error(error);
        });
        return null;
        var _a;
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
