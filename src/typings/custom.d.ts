declare module 'react-apollo' {
  export var ApolloProvider: any;
  export var connect: any;
}

declare interface IApolloState {
  queries: Object;
  mutations: Object;
}

declare interface IApolloDefinition {
  schema: string;
  queries?: Object;
  resolvers?: Object;
  mutations?: Object;
  queryText?: string;
  mutationText?: string;
}

declare module 'graphql-tag' {
  let gql: any;
  export default gql;
}
