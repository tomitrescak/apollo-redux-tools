"use strict";
var QUERY_INIT = 'APOLLO_QUERY_INIT';
var QUERY_RESULT = 'APOLLO_QUERY_RESULT';
//const QUERY_RESULT_CLIENT = 'APOLLO_QUERY_RESULT_CLIENT';
var MUTATION_INIT = 'APOLLO_MUTATION_INIT';
var MUTATION_RESULT = 'APOLLO_MUTATION_RESULT';
var queryMappings = {};
var regExQuery = /query ([\w_]*)/;
var regExBare = /\{\W*([\w_]*)/;
var mutationMappings = {};
var regExMutation = /mutation ([\w_]*)/;
// queries
function matchQueryName(qs) {
    var result = regExQuery.exec(qs);
    if (result) {
        return result[1];
    }
    return regExBare.exec(qs)[1];
}
function isQuery(action, name) {
    return getQuery(action) === name;
}
exports.isQuery = isQuery;
function stripTypeNames(obj) {
    if (obj.__typename) {
        delete (obj.__typename);
    }
    for (var t in obj) {
        // strip typename from the object
        if (obj[t] && obj[t].__typename) {
            var n = obj[t];
            delete (n.__typename);
        }
        // if the variable is object continue there
        if (obj[t] && typeof obj[t] === 'object') {
            stripTypeNames(obj[t]);
        }
        // if variable is array, process all children
        if (Array.isArray(obj[t])) {
            for (var _i = 0, _a = obj[t]; _i < _a.length; _i++) {
                var el = _a[_i];
                stripTypeNames(el);
            }
        }
    }
    return obj;
}
exports.stripTypeNames = stripTypeNames;
function getQuery(action) {
    if (action.type === QUERY_INIT) {
        if (!queryMappings[action.queryId]) {
            // add query with that name into the query index
            queryMappings[action.queryId] = matchQueryName(action.queryString);
        }
    }
    else if (action.type === QUERY_RESULT) {
        return queryMappings[action.queryId];
    }
    return null;
}
exports.getQuery = getQuery;
function copyQuery(state, stateKey, queryResult, queryKey, overwrite) {
    if (queryKey === void 0) { queryKey = '_id'; }
    if (overwrite === void 0) { overwrite = true; }
    if (queryResult) {
        // query maps
        var newKeys_1 = Object.assign({}, state[stateKey]);
        // copy all results to the new state
        if (Array.isArray(queryResult)) {
            queryResult.forEach(function (e) {
                if (overwrite || !newKeys_1[e[queryKey]]) {
                    newKeys_1[e[queryKey]] = stripTypeNames(e);
                }
            });
        }
        else {
            if (overwrite || !newKeys_1[queryResult[queryKey]]) {
                newKeys_1[queryResult[queryKey]] = stripTypeNames(queryResult);
            }
        }
        return Object.assign({}, state, (_a = {}, _a[stateKey] = newKeys_1, _a));
    }
    else {
        console.warn('When copying query, there was no result for: ' + stateKey);
        return state;
    }
    var _a;
}
exports.copyQuery = copyQuery;
// mutations
function matchMutationName(qs) {
    return regExMutation.exec(qs)[1];
}
function isMutation(action, name) {
    return getMutation(action) === name;
}
exports.isMutation = isMutation;
function getMutation(action) {
    if (action.type === MUTATION_INIT) {
        if (!mutationMappings[action.mutationId]) {
            // add query with that name into the query index
            mutationMappings[action.mutationId] = matchMutationName(action.queryString);
        }
    }
    else if (action.type === MUTATION_RESULT) {
        return mutationMappings[action.mutationId];
    }
    return null;
}
exports.getMutation = getMutation;
