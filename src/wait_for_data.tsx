import * as React from 'react';
import config from './config';
import { queriesFinished } from './helpers';

export interface Options {
  waitForAll?: boolean;
  LoadingView?: React.StatelessComponent<any>;
  AuthView?: React.StatelessComponent<any>;
  contextTypes?: Object;
  auth?: boolean;
  roles?: string[];
  // validation?<C> (props: any, context: any, keys?: string[], options?: Options): React.StatelessComponent<C>;
}

export default function connect<C>(keys: string[] = ['data'], options: Options = {}) {
  return function wait<P>(WrappedComponent: React.ComponentClass<P> | React.StatelessComponent<P>): React.StatelessComponent<C> {

    const func = (props: any, context: any) => {
      const Loading =  options.LoadingView ? options.LoadingView : config.loadingComponent;
      if (options.waitForAll && config.store) {
        if (!queriesFinished(config.store.getState().apollo)) {
          return <Loading {...props} />;
        }
      }

      // solve auth
      if (options.auth || options.roles) {
        if (config.isLoggingIn(context)) {
          return <config.LoggingIn {...props} />;
        }
        if (!config.userIdSelector(context) || (options.roles && options.roles.length && config.userRolesSelector(context).every(r => options.roles.indexOf(r) === -1))) {
          return options.AuthView ? <options.AuthView {...props} /> : <config.authComponent {...props} />;
        }
      }

      // wait for individual queries
      for (let key of keys) {
        let selector: string;
        if (key.indexOf('.') >= 0) {
          const splitKey = key.split('.');
          key = splitKey[0];
          selector = splitKey[1];
        }

        if (!props[key]) {
          console.error('Loading container did not find key in the apollo result set: ' + key);
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
        if (selector) {
          if (props[key][selector] == null) {
            return <Loading {...props} />;
          }
        } else if (props[key].loading) {
          return <Loading {...props} />;
        }
      }
      try {
        return <WrappedComponent {...props} />;
      } catch (ex) {
        console.error(ex.stack);
        throw ex;
      }
    };
    func.displayName = `WaitForLoad(${WrappedComponent.displayName || 'Component'})`;
    func.contextTypes = options.contextTypes || config.contextTypes;
    return func;
  };
}