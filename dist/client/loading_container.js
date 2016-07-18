var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import config from './config';
export function loadingContainer(Component, LoadingView, keys = ['data']) {
    if (Array.isArray(LoadingView)) {
        keys = LoadingView;
        LoadingView = null;
    }
    return (props) => {
        for (let key of keys) {
            if (!props[key]) {
                console.error('Key does not exist in the apollo result set: ' + key);
            }
            if (props[key].errors) {
                if (Array.isArray(props[key].errors)) {
                    for (let error of props[key].errors) {
                        if (error['message']) {
                            console.error(error['message']);
                        }
                        console.error(error);
                    }
                }
                else {
                    let m = props[key].errors;
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
                return LoadingView ? React.createElement(LoadingView, __assign({}, props)) : React.createElement(config.loadingComponent, __assign({}, props));
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
;
