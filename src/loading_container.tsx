import * as React from 'react';
import config from './config';
import { queriesFinished } from './helpers';

export function loadingContainer(Component: any, LoadingView?: any, keys: any = ['data'], waitForAll = true) {
  if (Array.isArray(LoadingView)) {
    keys = LoadingView;
    LoadingView = null;
  }

  return (props: any) => {
    // check if all queries has finished

    if (waitForAll && config.store) {
      if (!queriesFinished(config.store.getState().apollo)) {
        return LoadingView ? <LoadingView {...props} /> : <config.loadingComponent {...props} />;
      }
    }

    // wait for individual queries
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
        } else {
          let m = props[key].errors;
          if (m.networkError) {
            console.error(m.networkError.message);
            console.error(m.networkError.stack);
          } else if (m.message) {
            console.error(m.message);
            console.error(m.stack);
          } else {
            console.error(m);
          }
        }
      }
      if (props[key].loading) {
        return LoadingView ? <LoadingView {...props} /> : <config.loadingComponent {...props} />;
      }
    }
    try {
      return <Component {...props} />;
    } catch (ex) {
      console.error(ex.stack);
      throw ex;
    }
  };
};
