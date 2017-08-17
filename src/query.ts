import { ApolloError } from './error_logger';
import config from './config';
import { ApolloClient } from 'apollo-client';

export interface IQuery {
  client?: ApolloClient;
  context?: any;
  query: any;
  name?: string;
  variables?: Object;
  thenCallback?: (data: any, state: any, context: any) => void;
  catchCallback?: (error: ApolloError, state: any, context: any) => void;
  finalCallback?: (state: any, context: any) => void;
}

export default function({
  context,
  query,
  variables,
  thenCallback,
  catchCallback,
  finalCallback,
  client = config.apolloClient
}: IQuery) {
  const state = context ? context.state : null;
  return new Promise((resolve, reject) => {
    client
      .query({
        query,
        variables: variables
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
}
