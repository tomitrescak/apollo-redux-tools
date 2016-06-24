import { createApp as createMantraApp } from 'mantra-core';
import config from './config';

export function createApp(context: any, options: { loadingComponent: any, apolloClient: any }) {
  // assign context
  config.context = context;
  config.loadingComponent = options.loadingComponent;
  config.apolloClient = options.apolloClient;

  return createMantraApp(context);
}

export { default as connect } from './connect';
export { default as mutation } from './mutation';
export { default as query } from './query';
export { loadingContainer } from './loading_container';
export { isQuery, getQuery, isMutation, getMutation } from './reducer_extensions'
