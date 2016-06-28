const QUERY_INIT = 'APOLLO_QUERY_INIT';
const QUERY_RESULT = 'APOLLO_QUERY_RESULT';
//const QUERY_RESULT_CLIENT = 'APOLLO_QUERY_RESULT_CLIENT';
const MUTATION_INIT = 'APOLLO_MUTATION_INIT';
const MUTATION_RESULT = 'APOLLO_MUTATION_RESULT';
const queryMappings = {};
const regExQuery = /query ([\w_]*)/;
const regExBare = /\{\W*([\w_]*)/;
const mutationMappings = {};
const regExMutation = /mutation ([\w_]*)/;
// queries
function matchQueryName(qs) {
    let result = regExQuery.exec(qs);
    if (result) {
        return result[1];
    }
    return regExBare.exec(qs)[1];
}
export function isQuery(action, name) {
    return getQuery(action) === name;
}
export function getQuery(action) {
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
export function copyQuery(state, stateKey, queryResult, queryKey = '_id') {
    if (queryResult) {
        // query maps
        const newKeys = Object.assign({}, state[stateKey]);
        // copy all exercises to the new state
        queryResult.forEach((e) => {
            newKeys[e[queryKey]] = e;
        });
        return Object.assign({}, state, { [stateKey]: newKeys });
    }
}
// mutations
function matchMutationName(qs) {
    return regExMutation.exec(qs)[1];
}
export function isMutation(action, name) {
    return getMutation(action) === name;
}
export function getMutation(action) {
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
