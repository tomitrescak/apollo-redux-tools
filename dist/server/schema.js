let queries = '';
let mutations = '';
const schema = [];
const resolver = {};
export function schemas() { return schema; }
export function resolvers() { return resolver; }
export function processSchema(apolloDefinitions) {
    for (let apolloDefinition of apolloDefinitions) {
        if (apolloDefinition.schema) {
            schema.push(apolloDefinition.schema);
        }
        if (apolloDefinition.queries) {
            if (!resolver['RootQuery']) {
                resolver['RootQuery'] = {};
            }

            const queries = resolver['RootQuery'];
            const obj = apolloDefinition.queries;

            for (let resolverKey in obj) {
              if (queries[resolverKey]) {
                throw 'Resolver allready contains query: ' + resolverKey;
              }

              queries[resolverKey] = async (root, args, context) => {
                return obj[resolverKey](root, args, context);
              }
            }

            // Object.assign(resolver['RootQuery'], apolloDefinition.queries);
        }
        if (apolloDefinition.mutations) {
            if (!resolver['RootMutation']) {
                resolver['RootMutation'] = {};
            }

            // we add async execution
            const mutations = resolver['RootMutation'];
            const obj = apolloDefinition.mutations;

            for (let resolverKey in obj) {
              if (mutations[resolverKey]) {
                throw 'Resolver allready contains mutation: ' + resolverKey;
              }

              mutations[resolverKey] = async (root, args, context) => {
                return obj[resolverKey](root, args, context);
              }
            }
            // Object.assign(resolver['RootMutation'], apolloDefinition.mutations);
        }
        if (apolloDefinition.resolvers) {
            Object.assign(resolver, apolloDefinition.resolvers);
        }
        if (apolloDefinition.queryText) {
            queries += apolloDefinition.queryText + '\n';
        }
        if (apolloDefinition.mutationText) {
            mutations += apolloDefinition.mutationText + '\n';
        }
    }
    // add all the queries and mutations
    queries = `
    type RootQuery {
      ${queries}
    }
    `;
    schema.push(queries);
    if (mutations) {
        mutations = `
    type RootMutation {
      ${mutations}
    }
    `;
        schema.push(mutations);
    }
}
