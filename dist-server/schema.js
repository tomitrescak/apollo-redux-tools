let queries = '';
let mutations = '';
const schema = [];
const resolver = {};
export function schemas() { return schema; }
export function resolvers() { return resolver; }
export function processSchema(apolloDefinitions, show) {
    for (let apolloDefinition of apolloDefinitions) {
        if (apolloDefinition.schema) {
            schema.push(apolloDefinition.schema);
        }
        if (apolloDefinition.queries) {
            if (!resolver['RootQuery']) {
                resolver['RootQuery'] = {};
            }
            Object.assign(resolver['RootQuery'], apolloDefinition.queries);
        }
        if (apolloDefinition.mutations) {
            if (!resolver['RootMutation']) {
                resolver['RootMutation'] = {};
            }
            Object.assign(resolver['RootMutation'], apolloDefinition.mutations);
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

    if (show) {
        console.log(JSON.stringify(schema, null, 2).replace(/\\n/g, "\n"))
    }
}
