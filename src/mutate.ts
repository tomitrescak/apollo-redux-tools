import { ApolloError, createError, log } from './error_logger';

import { GraphQLResult } from 'graphql/graphql';
import config from './config';

export interface IMutation {
  context: any;
  query: any;
  name?: string;
  variables?: Object;
  updateQueries?: Object;
  optimisticCallback?: (state: any, context: any) => void;
  thenCallback?: (data: any, state: any, context: any) => void;
  catchCallback?: (error: ApolloError, state: any, context: any) => void;
  finalCallback?: (state: any, context: any) => void;
  optimisticResponse?: any;
}

export default function ({ context, query, name, variables, updateQueries, optimisticCallback, thenCallback, catchCallback, finalCallback, optimisticResponse }: IMutation): void {
  const state = context ? context.state : null;

  if (optimisticCallback) {
    optimisticCallback(state, context);
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
    optimisticResponse: optimistic,
    updateQueries: updateQueries,
  }).then((graphQLResult: GraphQLResult) => {
    const { errors, data } = graphQLResult;

    if (errors) {
      // showMessage('Error', errors.map((e: any) => e.message).join('\n'));
      log(createError(errors));
      catchCallback(createError(errors), state, context);
    } else if (data && thenCallback) {
      thenCallback(data, state, context);
    }

    if (finalCallback) {
      finalCallback(state, context);
    }
  }).catch((error: ApolloError) => {
    // showMessage('Error', error.message ? (error.message + error.stack) : error);
    log(error);
    if (catchCallback) {
      catchCallback(error, state, context);
    }

    if (finalCallback) {
      finalCallback(state, context);
    }
  });
};

