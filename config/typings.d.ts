/// <reference path="./react.d.ts"/>

import React = __React;

declare interface IApolloState {
  queries: Object;
  mutations: Object;
}

declare interface IApolloQueryDefinition {
  schema: string;
  queries?: Object;
  resolvers?: Object;
  mutations?: Object;
  queryText?: string;
  mutationText?: string;
}

declare module 'apollo-mantra/server' {
  export function processSchema(definition: IApolloQueryDefinition[]): void;
  export function schemas(): any;
  export function resolvers(): any;
  export function ioSchema(type: string): void;
  export function modificationSchema(): string;
}

declare module 'apollo-mantra' {
  interface IConnectFunctions {
    initContainer?: Function;
    mapStateToProps?: Function;
    mapDispatchToProps?: Function;
    mapQueriesToProps?: Function;
    mapMutationsToProps?: Function;
  }

  interface IQuery {
    query: string;
    variables?: Object;
    optimisticCallback?: (dispatch: Function, state: () => any) => void;
    thenCallback?: (data: any, dispatch: Function, state: () => any) => void;
    errorCallback?: (errors: any, dispatch: Function, state: () => any) => void;
    catchCallback?: (error: any, dispatch: Function, state: () => any) => void;
    finalCallback?: (dispatch: Function, state: () => any) => void;
  }

  interface IResult<T> {
    type: string;
    result: {
      data: T
    }
  }

  interface IMutationResult<T> extends IResult<T> {
    mutationId: string;
  }

  interface IQueryResult<T> extends IResult<T> {
    queryId: string;
    requestId: number;
  }

  interface IOptions {
    loadingComponent?: any;
    apolloClient?: any;
    store: any;
  }

  export function query(query: IQuery): void;
  export function mutation(query: IQuery): void;
  export function createApp(context: any, options: IOptions): any;
  export function composeAll<V>(...composeFunctions: Function[]):
    (component: any, loadingComponent?: any) => () => React.Component<V, {}>;
  export function compose<T>(funcs: IConnectFunctions): (component: any) => React.StatelessComponent<T>;
  export function connect<T>(funcs: IConnectFunctions): (component: any) => React.StatelessComponent<T>;
  export function loadingContainer(component: any, keys?: string[]): any;
  export function loaderContainer(component: any, mapProps?: (context: any, ownProps: any) => void): any;
  export function loadingContainer(component: any, loading?: any, keys?: string[]): any;
  export function copyQuery(state: Object, stateKey: string, queryResult: Object[], queryKey?: string, overwrite?: boolean): Object;
  export function isQuery(action: any, queryName: string): boolean;
  export function getQuery<T>(action: any): string;
  export function isMutation(action: any, queryName: string): boolean;
  export function getMutation<T>(action: any): string;
  export function queriesFinished(state: IApolloState): boolean;
}