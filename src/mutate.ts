import { ApolloError } from './error_logger';
import config from './config';

export interface IMutation {
  context?: any;
  query: any;
  name?: string;
  variables?: Object;
  updateQueries?: any;
  optimisticCallback?: (state: any, context: any) => void;
  thenCallback?: (data: any, state: any, context: any) => void;
  catchCallback?: (error: ApolloError, state: any, context: any) => void;
  finalCallback?: (state: any, context: any) => void;
  optimisticResponse?: any;
}

export default function ({ context, query, name, variables, updateQueries, optimisticCallback, thenCallback, catchCallback, finalCallback, optimisticResponse }: IMutation) {
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

  return new Promise((resolve, reject) => {
    config.apolloClient
      .mutate({
        mutation: query,
        variables: variables,
        optimisticResponse: optimistic,
        updateQueries: updateQueries
      })
      .then(graphQLResult => {
        const { data } = graphQLResult;

        if (data && thenCallback) {
          thenCallback(data, state, context);
        }

        if (finalCallback) {
          finalCallback(state, context);
        }
        resolve(graphQLResult);
      })
      .catch((error: ApolloError) => {
        // showMessage('Error', error.message ? (error.message + error.stack) : error);
        // log(error);
        // context.Utils.log.error(error);
        if (catchCallback) {
          catchCallback(error, state, context);
        }
        if (finalCallback) {
          finalCallback(state, context);
        }
        reject(error);
      });
  });
};

