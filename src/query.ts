import { ApolloError, createError, log } from './error_logger';

import { GraphQLResult } from 'graphql/graphql';
import config from './config';

export interface IQuery {
  context: any;
  query: any;
  variables?: Object;
  optimisticCallback?: (state: any) => void;
  thenCallback?: (data: any, state: any) => void;
  catchCallback?: (error: ApolloError, state: any) => void;
  finalCallback?: (state: any) => void;
}

export default function({ context, query, variables, optimisticCallback, thenCallback, catchCallback, finalCallback }: IQuery) {
  const state = context.state;
  if (optimisticCallback) {
    optimisticCallback(state);
  }

  config.apolloClient.mutate({
    mutation: query,
    variables: variables
  }).then((graphQLResult: GraphQLResult) => {
    const { errors, data } = graphQLResult;

    if (errors) {
      // showMessage('Error', errors.map((e: any) => e.message).join('\n'));
      catchCallback(createError(errors), state);
    } else if (data && thenCallback) {
      thenCallback(data, state);
    }

    if (finalCallback) {
      finalCallback(state);
    }
  }).catch((error: ApolloError) => {
    // showMessage('Error', error.message ? (error.message + error.stack) : error);
    if (catchCallback) {
      catchCallback(error, state);
    } else {
      log(error);
    }

    if (finalCallback) {
      finalCallback(state);
    }
  });
}
