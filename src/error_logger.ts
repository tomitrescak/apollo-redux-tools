import { GraphQLError } from 'graphql';

export interface ApolloError {
    message: string;
    graphQLErrors: GraphQLError[];
    networkError?: Error;
    extraInfo?: any;
    stack?: string;
}

export function createError(errors: GraphQLError[]): ApolloError {
  return {
    message: errors.map(e => e.message).join('\n'),
    graphQLErrors: errors,
    stack: errors.length ? errors[0].stack : ''
  };
}

export function log(error: ApolloError) {
  if (console.group) {
    console.group('Apollo Error');
  }
  console.error(error.message);
  if (error.networkError) {
    console.error(error.networkError);
    console.error(error.networkError.stack);
  } else {
    console.error(error);
    console.error(error.stack);
  }
  if (console.group) {
    console.groupEnd();
  }
}
