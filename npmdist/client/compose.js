"use strict";
var mantra_core_1 = require('mantra-core');
var config_1 = require('./config');
function compose(composer, loadingComponent) {
    return mantra_core_1.compose(function (ownProps, onData) { return composer(config_1.default.context, ownProps, onData); });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = compose;
