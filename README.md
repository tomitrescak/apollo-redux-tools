# Apollo and Redux Tools

This set of helpers facilitates the use of GraphQL and Apollo with your React/Redux application.

It allows you to:

1. Define queries and mutations using object notation for better code clarity
2. Copy query results to redux store for easier optimistic callbacks
3. Use higer order elements to display messages based on query easier



# Server

The server functionality has been moved to: [apollo-modules](https://www.npmjs.com/package/apollo-modules)

# Client

Client helpers exists in the `apollo-mantra` module and focus on easy integration of apollo in redux projects.

Following is a list of helpers:

## Query and Mutation Helpers

These helpers provide a possibility to define queries and mutations in object format, which facilitates the code readibility. Following is the structure of the query.

```typescript
interface IQuery {
  query: string;
  variables?: Object;
  pollInterval: number; // watch query only
  returnPartialData: boolean;  // watch query only
  forceFetch: boolean;
  optimisticCallback?: (dispatch: Function, state: () => any) => void;
  thenCallback?: (data: any, dispatch: Function, state: () => any) => void;
  errorCallback?: (errors: any, dispatch: Function, state: () => any) => void;
  catchCallback?: (error: any, dispatch: Function, state: () => any) => void;
  finalCallback?: (dispatch: Function, state: () => any) => void;
}
```

1. `query(query: IQuery): void` create query using object definition
1. `watchQuery(query: IQuery): void` create watch query using object definiton and return an observer
2. `mutation(query: IQuery): void` create mutation using object definition

The query returns an action that should be dispatched via *redux store*, watchQuery returns an observer.

## Application Helpers

1. `createApp(context: any, options: IOptions): any` create a new apollo based application and expose **context** into all redux and apollo function calls

## Container Helpers

1. `connect<T>(funcs: IConnectFunctions): (component: any) => React.StatelessComponent<T>` use as standard redux or apollo *connect* function, but all realted functions will now have application context as their first parameter:
   1. `mapStateToProps(context: any, state: any, ownProps: any): void`
   1. `mapDispatchToProps(context: any, dispatch: any, ownProps: any): void`
   1. `mergeProps(context: any, state: any, ownProps: any): void`
   1. `mapQueriesToProps(context: any, props: any): void`
   1. `mapMutationsToProps(context: any, props: any): void`
2. `loadingContainer(component: any, keys?: string[]): any` higher order component that shows a loading control while queries are loading
3. `loadingContainer(component: any, loading?: any, keys?: string[]): any` higher order component that shows a loading control while queries are loading
4. `queriesFinished(state: IApolloState): boolean` decides whether all queries currently finished loading

## Reducer Helpers

Please see the [reducer example](#reducer).

7. `copyQuery(state: Object, stateKey: string, queryResult: Object[], queryKey?: string, overwrite?: boolean): Object` copies a query result into the store
8. `isQuery(action: any, queryName: string): boolean` checks whether a given action represent a query call with a given name
9. `getQuery<T>(action: any): string` obtains a result of a query with a specified name
10. `isMutation(action: any, queryName: string): boolean` checks whether a given action represent a query call with a given name
11. `getMutation<T>(action: any): string` obtains a result of a mutation with a specified name


# Examples

List of examples of common uses of our helpers

## Reducer<a name="reducer" id="reducer"></a>

This is how you can copy apollo query results to the store.

```typescript
import { getQuery, copyQuery } from 'apollo-mantra';
import update from 'react-addons-update';

export interface IMarkingState {
  showMarked: boolean;
  showPending: boolean;
  solutions: Cs.Entities.ISolution[];
  current: { [index: string]: Cs.Entities.ISolution };
}


export default function reducer(state: IMarkingState = { showMarked: false, showPending: false, solutions: [], practical: {}, current: null }, action: any) {

  // when we execute a specific query, we want to copy its values nto the store
  switch (getQuery(action)) {
    case 'practical':
      // the copy query will copy the query reult into the key 'practical' and add a new
      // field under its '_id'. e.g. practical.id1 = result
      return copyQuery(state, 'practicals', action.result.data.practical, '_id');
    case 'markingSolutions':
      // we want to merge results with what is currently in the store
      const res = action.result.data.markingSolutions;
      const eliminateDuplicates = (s: Cs.Entities.ISolution) => !res.find((r: Cs.Entities.ISolution) => r._id === s._id);

      if (res && res.length) {
        let output = res.concat(state.solutions.filter(eliminateDuplicates));
        return update(state, { solutions: { $set: output } });
      }
      return state;
  }

  switch (action.type) {
    // other reducer stuff
  }
  return state;
}
```

## Calling a query or a mutation

```ts
const mutation = mutation({
  query: `mutation requestResetPassword($email: String!) {
    requestResetPassword(email: $email)
  }`,
  variables: {
    email
  },
  errorCallback: (err) => {
    if (err.message === 'User not found [403]') {
      dispatch(actions.showError('accounts.error.emailNotFound'));
    } else {
      dispatch(actions.showError('accounts.error.unknownError'));
    }
    if (callback) { callback(); }
  },
  thenCallback: (data: any) => {
    dispatch(actions.showError('accounts.messages.passwordResetEmailSent'));
    if (callback) { callback(); }
  }
});

dispatch(mutation);
```
