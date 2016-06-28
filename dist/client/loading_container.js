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
                    //console.error(m.message);
                    console.error(m.stack);
                }
            }
            if (props[key].loading) {
                return LoadingView ? <LoadingView {...props}/> : <config.loadingComponent {...props}/>;
            }
        }
        try {
            return <Component {...props}/>;
        }
        catch (ex) {
            console.error(ex.stack);
            throw ex;
        }
    };
}
;
