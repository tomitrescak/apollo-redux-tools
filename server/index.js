import {
  apolloServer
} from 'graphql-tools';
import express from 'express';
import proxyMiddleware from 'http-proxy-middleware';

import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const graphQLServer = express();
const resolverBuilder = {};

export function initServer({ schema, resolvers = resolverBuilder, port = 4000 }) {
  graphQLServer.use('/graphql', apolloServer(async(req) => {
    let user = null;
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      check(token, String);
      const hashedToken = Accounts._hashLoginToken(token);

      user = await Meteor.users.findOne({
        "services.resume.loginTokens.hashedToken": hashedToken
      });
    }

    const res = {
      graphiql: true,
      pretty: true,
      schema,
      resolvers,
      context: {
        // The current user will now be available on context.user in all resolvers
        user,
      }
    };
    return res;
  }));

  graphQLServer.listen(port, () => console.log(
    `GraphQL Server is now running on http://localhost:${port}`
  ));

  WebApp.rawConnectHandlers.use(proxyMiddleware(`http://localhost:${port}/graphql`));
}


// this allows us to incrementally build resolvers and to avoid the async keyword

export function addQueries(fcs) {
  addResolvers("Query", fcs);
}

export function addMutations(fcm) {
  addResolvers("Mutation", fcm);
}

export function addResolvers(key, obj) {
  if (!resolverBuilder[key]) {
    resolverBuilder[key] = {};
  }

  for (let resolverKey in obj) {
    if (resolverBuilder[key][resolverKey]) {
      throw 'Resolver allready contains: ' + resolverKey;
    }

    resolverBuilder[key][resolverKey] = async (root, args, context) => {
      return obj[resolverKey](root, args, context);
    }
  }
}

export function addAsyncResolvers(key, obj) {
  if (!resolverBuilder[key]) {
    resolverBuilder[key] = {};
  }

  for (let resolverKey in obj) {
    if (resolverBuilder[key][resolverKey]) {
      throw 'Resolver allready contains: ' + resolverKey;
    }
    resolverBuilder[key][resolverKey] = obj[resolverKey];
  }
}
