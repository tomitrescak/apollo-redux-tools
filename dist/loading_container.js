"use strict";
var config_1 = require('./config');
function loadingContainer(component, loadingView, keys) {
    if (keys === void 0) { keys = ['data']; }
    if (Array.isArray(loadingView)) {
        keys = loadingView;
    }
    return function (props) {
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
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
                    console.error(props[key].errors);
                }
            }
            if (props[key].loading) {
                return loadingView ? loadingView(props) : config_1.default.loadingComponent(props);
            }
        }
        try {
            return component(props);
        }
        catch (ex) {
            console.error(ex.stack);
            throw ex;
        }
    };
}
exports.loadingContainer = loadingContainer;
;
