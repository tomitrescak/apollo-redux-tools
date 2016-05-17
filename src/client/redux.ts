// mantra

import { createApp as createMantraApp } from 'mantra-core';

// redux

import { createStore, combineReducers, applyMiddleware, compose } from 'redux' ;
import createLogger from 'redux-logger';
import ReduxThunk from 'redux-thunk';

// apollo

import { apolloClient } from './apollo';

// extended mantra class

class MantraRedux {
  app: any;
  modules: any[];
  store: any;
  context: any;

  assignContext(context: any) {
    this.app = createMantraApp(context);
    this.modules = [];
    this.context = context;
  }

  loadModule(moduleDefinition: any) {
    this.app.loadModule(moduleDefinition);

    // rememeber reducers

    if (moduleDefinition.reducers) {
      this.modules.push(moduleDefinition);
    }
  }

  init() {
    this.app.init();

    // prepare middlewares

    const middleware = [apolloClient.middleware(), ReduxThunk];
    if (process.env.NODE_ENV === 'development' && !window['devToolsExtension']) {
      const logger = createLogger();
      middleware.push(logger);
    }

    // prepare all reducers

    let reducers = { apollo: apolloClient.reducer() };
    for (let mantraModule of this.modules) {
      reducers = Object.assign(reducers, mantraModule.reducers);
    }

    this.store = createStore(
      combineReducers(reducers),
      {},
      compose(
      applyMiddleware(...middleware)
       ,
        window['devToolsExtension'] ? window['devToolsExtension']() : f => f
      )
    );

    this.context.Store = this.store;

    // if (module['hot']) {
    //     // Enable Webpack hot module replacement for reducers
    //     module['hot'].accept('../reducers', () => {
    //       const nextReducer = require('../reducers').default;
    //       store.replaceReducer(nextReducer);
    //     });
    //   }
  }
}

export let mantraRedux = new MantraRedux(); // this instance is used for accessing the store

export const createApp = (context: any) => {
  mantraRedux.assignContext(context);
  return mantraRedux;
};
