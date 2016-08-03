"use strict";
var queries = '';
var mutations = '';
var schema = [];
var resolver = {};
function schemas() { return schema; }
exports.schemas = schemas;
function resolvers() { return resolver; }
exports.resolvers = resolvers;
function processSchema(apolloDefinitions) {
    for (var _i = 0, apolloDefinitions_1 = apolloDefinitions; _i < apolloDefinitions_1.length; _i++) {
        var apolloDefinition = apolloDefinitions_1[_i];
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
    queries = "\n    type RootQuery {\n      " + queries + "\n    }\n    ";
    schema.push(queries);
    if (mutations) {
        mutations = "\n    type RootMutation {\n      " + mutations + "\n    }\n    ";
        schema.push(mutations);
    }
}
exports.processSchema = processSchema;
