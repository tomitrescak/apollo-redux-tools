"use strict";
var mantra_core_1 = require('mantra-core');
var config_1 = require('./config');
function createApp(context, options) {
    // assign context
    config_1.default.context = context;
    config_1.default.loadingComponent = options.loadingComponent;
    config_1.default.apolloClient = options.apolloClient;
    return mantra_core_1.createApp(context);
}
exports.createApp = createApp;
var connect_1 = require('./connect');
exports.connect = connect_1.default;
var compose_1 = require('./compose');
exports.compose = compose_1.default;
var mantra_core_2 = require('mantra-core');
exports.composeAll = mantra_core_2.composeAll;
var mutation_1 = require('./mutation');
exports.mutation = mutation_1.default;
var query_1 = require('./query');
exports.query = query_1.default;
var loading_container_1 = require('./loading_container');
exports.loadingContainer = loading_container_1.loadingContainer;
var reducer_extensions_1 = require('./reducer_extensions');
exports.isQuery = reducer_extensions_1.isQuery;
exports.getQuery = reducer_extensions_1.getQuery;
exports.isMutation = reducer_extensions_1.isMutation;
exports.getMutation = reducer_extensions_1.getMutation;
exports.copyQuery = reducer_extensions_1.copyQuery;
var helpers_1 = require('./helpers');
exports.queriesFinished = helpers_1.queriesFinished;
