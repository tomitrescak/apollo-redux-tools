import config from './config';
export function loadingContainer(component, loadingView, keys = ['data'], dispatch) {
    if (Array.isArray(loadingView)) {
        keys = loadingView;
        loadingView = null;
    }
    return function (props) {
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
                    console.error(props[key].errors);
                }
            }
            if (props[key].loading) {
                return loadingView ? loadingView(props) : config.loadingComponent(props);
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
;
