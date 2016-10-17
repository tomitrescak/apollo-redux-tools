// import { createApp as createMantraApp } from 'mantra-core';
import config from './config';
import './polyfills';

declare global {
  export interface ObjectConstructor {
    assign(el: any, ...els: any[]): any;
  }
}

export function createApp(context: any, options?: { loadingComponent: any, apolloClient: any, store: any }) {
  // assign context
  config.context = context;
  if (options) {
    config.loadingComponent = options.loadingComponent;
    config.apolloClient = options.apolloClient;
    config.store = options.store;
  }

  // return createMantraApp(context);
}

export { default as connect } from './connect';
// export { default as compose } from './compose';
// export { composeAll } from 'mantra-core';
export { default as mutation, IMutation } from './mutation';
export { default as query, IQuery } from './query';
export { default as watchQuery } from './watch_query';
export { loadingContainer } from './loading_container';
export { default as loaderContainer } from './loader_container';
export { isQuery, getQuery, isMutation, getMutation, copyQuery } from './reducer_extensions';
export { queriesFinished } from './helpers';
