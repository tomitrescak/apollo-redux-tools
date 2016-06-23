"use strict";
var mantra_core_1 = require('mantra-core');
var config_1 = require('./config');
function createApp(context, loadingComponent) {
    // assign context
    config_1.default.context = context;
    config_1.default.loadingComponent = loadingComponent;
    return mantra_core_1.createApp(context);
}
exports.createApp = createApp;
var connect_1 = require('./connect');
exports.connect = connect_1.default;
var schema_1 = require('./schema');
exports.processSchema = schema_1.processSchema;
exports.schemas = schema_1.schemas;
exports.resolvers = schema_1.resolvers;
var loading_container_1 = require('./loading_container');
exports.loadingContainer = loading_container_1.loadingContainer;
