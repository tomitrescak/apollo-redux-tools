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
export function stripTypeNames(obj) {
    if (obj.__typename) {
        delete (obj.__typename);
    }
    for (let t in obj) {
        // strip typename from the object
        if (obj[t] && obj[t].__typename) {
            const n = obj[t];
            delete (n.__typename);
        }
        // if the variable is object continue there
        if (obj[t] && typeof obj[t] === 'object') {
            stripTypeNames(obj[t]);
        }
        // if variable is array, process all children
        if (Array.isArray(obj[t])) {
            for (let el of obj[t]) {
                stripTypeNames(el);
            }
        }
    }
    return obj;
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
export function copyQuery(state, stateKey, queryResult, queryKey = '_id', overwrite = true) {
    if (queryResult) {
        // query maps
        const newKeys = Object.assign({}, state[stateKey]);
        // copy all results to the new state
        if (Array.isArray(queryResult)) {
            queryResult.forEach((e) => {
                if (overwrite || !newKeys[e[queryKey]]) {
                    newKeys[e[queryKey]] = stripTypeNames(e);
                }
            });
        }
        else {
            if (overwrite || !newKeys[queryResult[queryKey]]) {
                newKeys[queryResult[queryKey]] = stripTypeNames(queryResult);
            }
        }
        return Object.assign({}, state, { [stateKey]: newKeys });
    }
    else {
        console.warn('When copying query, there was no result for: ' + stateKey);
        return state;
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
