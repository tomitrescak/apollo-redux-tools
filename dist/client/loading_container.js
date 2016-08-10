"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require('react');
var config_1 = require('./config');
var helpers_1 = require('./helpers');
function loadingContainer(Component, LoadingView, keys, waitForAll) {
    if (keys === void 0) { keys = ['data']; }
    if (waitForAll === void 0) { waitForAll = true; }
    if (Array.isArray(LoadingView)) {
        keys = LoadingView;
        LoadingView = null;
    }
    return function (props) {
        // check if all queries has finished
        if (waitForAll && config_1.default.store) {
            if (!helpers_1.queriesFinished(config_1.default.store.getState().apollo)) {
                return LoadingView ? React.createElement(LoadingView, __assign({}, props)) : React.createElement(config_1.default.loadingComponent, __assign({}, props));
            }
        }
        // wait for individual queries
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (!props[key]) {
                console.error('Key does not exist in the apollo result set: ' + key);
            }
            if (props[key].errors) {
                if (Array.isArray(props[key].errors)) {
                    for (var _a = 0, _b = props[key].errors; _a < _b.length; _a++) {
                        var error = _b[_a];
                        if (error['message']) {
                            console.error(error['message']);
                        }
                        console.error(error);
                    }
                }
                else {
                    var m = props[key].errors;
                    if (m.networkError) {
                        console.error(m.networkError.message);
                        console.error(m.networkError.stack);
                    }
                    else if (m.message) {
                        console.error(m.message);
                        console.error(m.stack);
                    }
                    else {
                        console.error(m);
                    }
                }
            }
            if (props[key].loading) {
                return LoadingView ? React.createElement(LoadingView, __assign({}, props)) : React.createElement(config_1.default.loadingComponent, __assign({}, props));
            }
        }
        try {
            return React.createElement(Component, __assign({}, props));
        }
        catch (ex) {
            console.error(ex.stack);
            throw ex;
        }
    };
}
exports.loadingContainer = loadingContainer;
;
