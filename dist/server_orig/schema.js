var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
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
                queries[resolverKey] = (root, args, context) => __awaiter(this, void 0, void 0, function* () {
                    return obj[resolverKey](root, args, context);
                });
            }
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
                mutations[resolverKey] = (root, args, context) => __awaiter(this, void 0, void 0, function* () {
                    return obj[resolverKey](root, args, context);
                });
            }
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
