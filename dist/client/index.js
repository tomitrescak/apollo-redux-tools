"use strict";
// import { createApp as createMantraApp } from 'mantra-core';
var config_1 = require('./config');
require('./polyfills');
function createApp(context, options) {
    // assign context
    config_1.default.context = context;
    config_1.default.loadingComponent = options.loadingComponent;
    config_1.default.apolloClient = options.apolloClient;
    config_1.default.store = options.store;
    // return createMantraApp(context);
}
exports.createApp = createApp;
var connect_1 = require('./connect');
exports.connect = connect_1.default;
// export { default as compose } from './compose';
// export { composeAll } from 'mantra-core';
var mutation_1 = require('./mutation');
exports.mutation = mutation_1.default;
var query_1 = require('./query');
exports.query = query_1.default;
var watch_query_1 = require('./watch_query');
exports.watchQuery = watch_query_1.default;
var loading_container_1 = require('./loading_container');
exports.loadingContainer = loading_container_1.loadingContainer;
var loader_container_1 = require('./loader_container');
exports.loaderContainer = loader_container_1.default;
var reducer_extensions_1 = require('./reducer_extensions');
exports.isQuery = reducer_extensions_1.isQuery;
exports.getQuery = reducer_extensions_1.getQuery;
exports.isMutation = reducer_extensions_1.isMutation;
exports.getMutation = reducer_extensions_1.getMutation;
exports.copyQuery = reducer_extensions_1.copyQuery;
var helpers_1 = require('./helpers');
exports.queriesFinished = helpers_1.queriesFinished;
