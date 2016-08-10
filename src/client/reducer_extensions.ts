const QUERY_INIT = 'APOLLO_QUERY_INIT';
const QUERY_RESULT = 'APOLLO_QUERY_RESULT';
//const QUERY_RESULT_CLIENT = 'APOLLO_QUERY_RESULT_CLIENT';

const MUTATION_INIT = 'APOLLO_MUTATION_INIT';
const MUTATION_RESULT = 'APOLLO_MUTATION_RESULT';

const queryMappings: any = {};
const regExQuery = /query ([\w_]*)/;
const regExBare = /\{\W*([\w_]*)/;

const mutationMappings: any = {};
const regExMutation = /mutation ([\w_]*)/;

// queries

function matchQueryName(qs: string) {
  let result = regExQuery.exec(qs);
  if (result) {
    return result[1];
  }
  return regExBare.exec(qs)[1];
}

export function isQuery(action: any, name: String) {
  return getQuery(action) === name;
}

export function stripTypeNames(inputObj: any) {
  const obj = Object.assign({}, inputObj);

  if (obj.__typename) {
    delete (obj.__typename);
  }

  for (let t in obj) {

    // strip typename from the object
    // if (obj[t] && obj[t].__typename) {
    //   const n = obj[t];
    //   delete (n.__typename);
    // }

    // if the variable is object continue there

    if (!Array.isArray(obj[t]) && obj[t] && typeof obj[t] === 'object') {
      obj[t] = stripTypeNames(obj[t]);
    }

    // if variable is array, process all children
    if (Array.isArray(obj[t])) {
      let na: any[] = [];
      for (let el of obj[t]) {
        if (typeof el === 'object') {
          na.push(stripTypeNames(el));
        } else {
          na.push(el);
        }
      }
      obj[t] = na;
    }
  }
  return obj;
}

export function getQuery(action: any) {
  if (action.type === QUERY_INIT) {
    if (!queryMappings[action.queryId]) {
      // add query with that name into the query index
      queryMappings[action.queryId] = matchQueryName(action.queryString);
    }
  } else if (action.type === QUERY_RESULT) { // || action.type === QUERY_RESULT_CLIENT) {
    return queryMappings[action.queryId];
  }
  return null;
}

export function copyQuery(state: Object, stateKey: string, queryResult: Object | Object[], queryKey = '_id', overwrite = true): Object {
  if (queryResult) {
    let newKeys: any = queryResult;

    if (queryKey) {
      // query maps
      newKeys = Object.assign({}, state[stateKey]);
      // copy all results to the new state
      if (Array.isArray(queryResult)) {
        if (queryResult.length === 0) {
          return state;
        }
        queryResult.forEach((e) => {
          if (overwrite || !newKeys[e[queryKey]]) {
            newKeys[e[queryKey]] = stripTypeNames(e);
          }
        });
      } else {
        if (overwrite || !newKeys[queryResult[queryKey]]) {
          newKeys[queryResult[queryKey]] = stripTypeNames(queryResult);
        }
      }
    }
    return Object.assign({}, state, { [stateKey]: newKeys });
  } else {
    // console.warn('When copying query, there was no result for: ' + stateKey);
    return state;
  }
}

// mutations

function matchMutationName(qs: string) {
  return regExMutation.exec(qs)[1];
}

export function isMutation(action: any, name: String) {
  return getMutation(action) === name;
}

export function getMutation(action: any) {
  if (action.type === MUTATION_INIT) {
    if (!mutationMappings[action.mutationId]) {
      // add query with that name into the query index
      mutationMappings[action.mutationId] = matchMutationName(action.queryString);
    }
  } else if (action.type === MUTATION_RESULT) {
    return mutationMappings[action.mutationId];
  }
  return null;
}
