"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var queries = '';
var mutations = '';
var schema = [];
var resolver = {};
function schemas() { return schema; }
exports.schemas = schemas;
function resolvers() { return resolver; }
exports.resolvers = resolvers;
function processSchema(apolloDefinitions) {
    var _loop_1 = function(apolloDefinition) {
        if (apolloDefinition.schema) {
            schema.push(apolloDefinition.schema);
        }
        if (apolloDefinition.queries) {
            if (!resolver['RootQuery']) {
                resolver['RootQuery'] = {};
            }
            var queries_1 = resolver['RootQuery'];
            var obj_1 = apolloDefinition.queries;
            var _loop_2 = function(resolverKey) {
                if (queries_1[resolverKey]) {
                    throw 'Resolver allready contains query: ' + resolverKey;
                }
                queries_1[resolverKey] = function (root, args, context) __awaiter(this, void 0, void 0, function* () {
                    return obj_1[resolverKey](root, args, context);
                });
            };
            for (var resolverKey in obj_1) {
                _loop_2(resolverKey);
            }
        }
        if (apolloDefinition.mutations) {
            if (!resolver['RootMutation']) {
                resolver['RootMutation'] = {};
            }
            // we add async execution
            var mutations_1 = resolver['RootMutation'];
            var obj_2 = apolloDefinition.mutations;
            var _loop_3 = function(resolverKey) {
                if (mutations_1[resolverKey]) {
                    throw 'Resolver allready contains mutation: ' + resolverKey;
                }
                mutations_1[resolverKey] = function (root, args, context) __awaiter(this, void 0, void 0, function* () {
                    return obj_2[resolverKey](root, args, context);
                });
            };
            for (var resolverKey in obj_2) {
                _loop_3(resolverKey);
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
    };
    for (var _i = 0, apolloDefinitions_1 = apolloDefinitions; _i < apolloDefinitions_1.length; _i++) {
        var apolloDefinition = apolloDefinitions_1[_i];
        _loop_1(apolloDefinition);
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
