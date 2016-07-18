import { createApp as createMantraApp } from 'mantra-core';
import config from './config';
export function createApp(context, options) {
    // assign context
    config.context = context;
    config.loadingComponent = options.loadingComponent;
    config.apolloClient = options.apolloClient;
    return createMantraApp(context);
}
export { default as connect } from './connect';
export { default as compose } from './compose';
export { composeAll } from 'mantra-core';
export { default as mutation } from './mutation';
export { default as query } from './query';
export { loadingContainer } from './loading_container';
export { isQuery, getQuery, isMutation, getMutation, copyQuery } from './reducer_extensions';
export { queriesFinished } from './helpers';
