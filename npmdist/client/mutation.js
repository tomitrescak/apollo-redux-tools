"use strict";
var config_1 = require('./config');
var sweetalert2_1 = require('sweetalert2');
function default_1(_a) {
    var query = _a.query, variables = _a.variables, optimisticCallback = _a.optimisticCallback, thenCallback = _a.thenCallback, errorCallback = _a.errorCallback, catchCallback = _a.catchCallback;
    return function (dispatch, state) {
        if (optimisticCallback) {
            optimisticCallback(dispatch, state);
        }
        config_1.default.apolloClient.mutate({
            mutation: (_a = ["", ""], _a.raw = ["", ""], gql(_a, query)),
            variables: variables
        }).then(function (graphQLResult) {
            var errors = graphQLResult.errors, data = graphQLResult.data;
            if (data && thenCallback) {
                thenCallback(data, dispatch, state);
            }
            if (errors) {
                showMessage('Error', errors.map(function (e) { return e.message; }).join('\n'));
                console.error(errors);
                if (errorCallback) {
                    errorCallback(errors, dispatch, state);
                }
            }
        }).catch(function (error) {
            showMessage('Error', error.message ? (error.message + error.stack) : error);
            if (catchCallback) {
                catchCallback(error, dispatch, state);
            }
            console.error(error);
            console.error(error.stack);
        });
        return null;
        var _a;
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function showMessage(title, text, type) {
    if (type === void 0) { type = 'error'; }
    if (sweetalert2_1.default) {
        sweetalert2_1.default({ title: title, text: text, type: type, confirmButtonText: 'OK' });
    }
    else {
        alert(title + ": " + text);
    }
}
exports.showMessage = showMessage;
