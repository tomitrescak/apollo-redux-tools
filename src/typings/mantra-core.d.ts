///////////////////////////////////////////////////////////////
// mantra                                                    //
///////////////////////////////////////////////////////////////

declare module 'mantra-core' {
  import React from 'react';
  
  interface IKomposer {
    (params: Object, onData: Function): Function;
  }

  interface IKomposerData<T> {
    (error?: Object, data?: T): void;
  }

  interface IInjectDeps {
    (...deps: any[]): IInjectDeps;
  }

  interface IDepsMapper {
    (...deps: any[]): void;
  }

  export var injectDeps: IInjectDeps;
  export function useDeps(depsMapper?: IDepsMapper): any;
  export function createApp(context: any): any;

  export function compose(komposer: IKomposer, loadingComponent?: any, bim?: any, opts?: { pure: Boolean }): any;
  export function composeWithTracker(komposer: IKomposer, loadingComponent?: any, bim?: any, opts?: { pure: Boolean }): any;
  export function composeWithPromise(): any;
  export function composeWithObservable(): any;
  export function composeAll<V>(...composeFunctions: Function[]):
    (component: any, loadingComponent?: any) => () => React.Component<V, {}>;
}
