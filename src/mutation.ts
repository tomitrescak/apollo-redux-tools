import { ApolloError, createError, log } from './error_logger';

import { GraphQLResult } from 'graphql/graphql';
import config from './config';

export interface IMutation {
  query: any;
  name?: string;
  variables?: Object;
  optimisticCallback?: (dispatch: Function, state: () => any) => void;
  thenCallback?: (data: any, dispatch: Function, state: () => any) => void;
  catchCallback?: (error: ApolloError, dispatch: Function, state: () => any) => void;
  finalCallback?: (dispatch: Function, state: () => any) => void;
  optimisticResponse?: any;
}

export default function({ query, name, variables, optimisticCallback, thenCallback, catchCallback, finalCallback, optimisticResponse }: IMutation) {
  return (dispatch: Function, state: () => any): any => {
    if (optimisticCallback) {
      optimisticCallback(dispatch, state);
    }

    let optimistic: any = null;
    if (optimisticResponse) {
      if (!name) {
        throw new Error('apollo-mantra: Please specify mutation name if you want to use optimistic callbacks!');
      }
      optimistic = { __typename: 'Mutation' };
      optimistic[name] = optimisticResponse;
    }

    config.apolloClient.mutate({
      mutation: query,
      variables: variables,
      optimisticResponse: optimistic
    }).then((graphQLResult: GraphQLResult) => {
      const { errors, data } = graphQLResult;

      if (errors) {
        // showMessage('Error', errors.map((e: any) => e.message).join('\n'));
        catchCallback(createError(errors), dispatch, state);
      } else if (data && thenCallback) {
        thenCallback(data, dispatch, state);
      }

      if (finalCallback) {
        finalCallback(dispatch, state);
      }
    }).catch((error: ApolloError) => {
      // showMessage('Error', error.message ? (error.message + error.stack) : error);
      if (catchCallback) {
        catchCallback(error, dispatch, state);
      } else {
        log(error);
      }

      if (finalCallback) {
        finalCallback(dispatch, state);
      }
    });
    return null;
  };
}
