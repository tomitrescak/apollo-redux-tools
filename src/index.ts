// import { createApp as createMantraApp } from 'mantra-core';
import config from './config';
import './polyfills';
import connect from './mobx';

declare global {
  export interface ObjectConstructor {
    assign(el: any, ...els: any[]): any;
  }
}

export function createApp(options?: { contextTypes?: any, loadingComponent: any, apolloClient: any, store?: any, state?: any }) {
  // assign context
  if (options) {
    config.loadingComponent = options.loadingComponent;
    config.apolloClient = options.apolloClient;
    config.store = options.store;
    if (options.contextTypes) {
      config.contextTypes = options.contextTypes;
      connect.contextTypes = options.contextTypes;
    }
  }

  // return createMantraApp(context);
}

// export { default as connect } from './connect';
export { default as connect } from './mobx';
// export { default as compose } from './compose';
// export { composeAll } from 'mantra-core';
export { default as mutation, IMutation } from './mutation';
export { default as mutate } from './mutate';
export { default as query, IQuery } from './query';
export { default as watchQuery } from './watch_query';
export { loadingContainer } from './loading_container';
export { default as waitForData } from './wait_for_data';
export { isQuery, getQuery, isMutation, getMutation, copyQuery } from './reducer_extensions';
export { queriesFinished } from './helpers';
