import React = __React;

export interface IState {
  dispatch: (...params: any[]) => Promise<any>;
  error?: string;
  post?: {
    error: string
  };
  apollo?: {
    data: any;
    mutations: any;
    queries: any;
  };
}

export function connect(...params: any[]): (elem) => void;

export class ApolloProvider extends React.Component<{},{}> { }

interface IMantraRedux {
  app: any;
  modules: any[];
  store: any;
  context: any;
  assignContext(context: any): void;
  loadModule(moduleDefinition: any): void;
  init(): void;
}

export let mantraRedux: IMantraRedux;
export function createApp(): IMantraRedux;
