import * as React from 'react';
import config from './config';

export function loadingContainer(Component: React.StatelessComponent<any>, LoadingView: React.StatelessComponent<any>, keys: any = ['data']) {
  if (Array.isArray(LoadingView)) {
    keys = LoadingView;
    LoadingView = null;
  }

  return (props: any) => {
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
        return LoadingView ?  <LoadingView {...props} /> : <config.loadingComponent {...props} />;
      }
    }
    try {
      return <Component {...props} /> ;
    } catch (ex) {
      console.error(ex.stack);
      throw ex;
    }
  };
};
