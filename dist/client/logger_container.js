"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var Loader = (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        _super.apply(this, arguments);
    }
    // check if all queries has finished
    // wait for individual queries
    Loader.prototype.render = function () {
        var _a = this.props, keys = _a.keys, Component = _a.Component;
        if (keys && keys.length) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (!this.props[key]) {
                    console.error('Key does not exist in the apollo result set: ' + key);
                }
                if (this.props[key].errors) {
                    if (Array.isArray(this.props[key].errors)) {
                        for (var _b = 0, _c = this.props[key].errors; _b < _c.length; _b++) {
                            var error = _c[_b];
                            if (error['message']) {
                                console.error(error['message']);
                            }
                            console.error(error);
                        }
                    }
                    else {
                        var m = this.props[key].errors;
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
            }
        }
        try {
            return React.createElement(Component, __assign({}, this.props));
        }
        catch (ex) {
            console.error(ex.stack);
            throw ex;
        }
    };
    Loader.prototype.componentWillMount = function () {
        if (this.props.componentWillMount) {
            this.props.componentWillMount();
        }
    };
    return Loader;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (component, mapProps) {
    return function (props) {
        var extraProps = mapProps ? mapProps(config_1.default.context, props) : {};
        return (React.createElement(Loader, __assign({Component: component}, extraProps, props)));
    };
};
