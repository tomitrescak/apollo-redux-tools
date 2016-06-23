declare interface IApolloDefinition {
  schema: string;
  queries?: Object;
  resolvers?: Object;
  mutations?: Object;
  queryText?: string;
  mutationText?: string;
}

declare module 'apollo-mantra' {
  interface IConnectFunctions {
    mapStateToProps?: Function;
    mapDispatchToProps?: Function;
    mapQueriesToProps?: Function;
    mapMutationsToProps?: Function;
  }

  interface IQuery {
    query: string;
    variables?: Object;
    thenCallback?: (data: any, dispatch: Function, state: () => any) => void;
    errorCallback?: (errors: any, dispatch: Function, state: () => any) => void;
    catchCallback?: (error: any, dispatch: Function, state: () => any) => void;
  }

  export function query(query: IQuery): void;
  export function mutation(query: IQuery): void;

  export function createApp(context: any, loadingComponent: any): any;
  export function schemas(): any;
  export function resolvers(): any;
  export function connect(funcs: IConnectFunctions): () => any;
  export function processSchema(definition: IApolloDefinition[]): void;

  export function loadingContainer(component: any, keys?: string[]): any;
  export function loadingContainer(component: any, loading?: any, keys?: string[]): any;
}
