# Apollo and Redux Tools

This set of helpers facilitates the use of GraphQL and Apollo, both in server and your React/Redux application. 

It allows you to:

1. Define schemas splits based on domain elements (queries, mutations, resolvers)
2. Define queries and mutations using object notation for better code clarity
3. Copy query results to redux store for easier optimistic callbacks
4. Use higer order elements to display messages based on query easier

# Server

Server functionality is defined in the `apollo-mantra/server` module and it focuses on the creation and modification of GraphQL schema. 
In `apollo-mantra` schemas are divided by `domain` definitions. Each domain element holds
the definition of it schema along with all queries, resolvers and mutations. Following is 
the definition of domain element schema:

```js
declare interface IApolloQueryDefinition {
  schema: string;
  queryText?: string;
  queries?: Object;
  resolvers?: Object;
  mutationText?: string;
  mutations?: Object;
}
```

Please see the section **Examples** examples on how to use the [domain element schema](#schema) and also how to use server helpers:

1. `processSchema(definition: IApolloQueryDefinition[]): void`: compiles schema of several domain elements (Example: [Generating schemas](#generation))
2. `schemas`: return all currently processed schemas for apollo server configuration (Example: [Server Configuration](#configuration))
3. `resolvers`: return all currently processed resolvers for apollo server configuration (Example: [Server Configuration](#configuration))
4. `ioSchema`: generates your defined schema type as both input and ouput type. This is used, when you want to be sending whole documents to GraphQL server and probably is not the best practice. When defining the IO type all you need to do is to append the $Input after the type name. (Example: [Advanced Schema](#ioschema))

# Client

Client helpers exists in the `apollo-mantra` module and focus on easy integration of apollo in redux projects.

Following is a list of helpers:

## Query and Mutation Helpers

These helpers provide a possibility to define queries and mutations in object format, which facilitates the code readibility. Following is the structure of the query.

```js
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

## Simple schema<a name="schema" id="schema"></a>

```js
import { Mongo } from 'meteor/mongo';
import { Exercises } from './exercise_schema';

export const Practicals = new Mongo.Collection<Cs.Collections.IPracticalDAO>('practicals');

const schema = `
  type Practical {
    _id: String
    name: String
    description: String
    exercises: [Exercise]
  }
`;

const queryText = `
  practical(id: String, userId: String): Practical
`;

const queries = {
  practical(root: any, { id }: any, { userId }: Apollo.IApolloContext): Cs.Collections.IPracticalDAO {
    if (!userId) {
      return;
    }
    return Practicals.findOne({ _id: id });
  }
};

const resolvers = {
  Practical: {
    exercises(practical: Cs.Collections.IPracticalDAO) {
      return Exercises.find({ _id: { $in: practical.exercises } }).fetch();
    }
  }
};

const definition: IApolloDefinition = {
  schema,
  resolvers,
  queries,
  queryText
};

export default definition;
```

## Schema with input/output elements <a name="schema" id="ioschema"></a>

```js
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { ioSchema } from 'apollo-mantra/server';

declare global {
  
export const Exercises = new Mongo.Collection<Cs.Collections.IExerciseDAO>('exercises');
export const Questions = new Mongo.Collection<Cs.Collections.IQuestionDAO>('questions');
export const Possibilities = new Mongo.Collection<Cs.Collections.IQuestionPossibilitiesDAO>('possibilities');
export const Solutions = new Mongo.Collection<Cs.Collections.ISolutionDAO>('solutions');

const schema = `
  ${ioSchema(`Exercise$Input {
    _id: String
    name: String
    instructions: String
    group: String
    questions: [Question$Input]
  }`)}

  ${ioSchema(`Question$Input {
    _id: String
    description: String
    question: String
    expectedAnswer: String
    validation: String
    control: String
    possibilities: [Possibility$Input]
    points: Float
  }`)}

  ${ioSchema(`Possibility$Input {
    question: String
    answer: String
  }`)}

  type Solution {
    _id: String
    userId: String
    user: String
    semesterId: String
    practicalId: String
    exerciseId: String
    questionId: String
    userQuestion: String
    expectedAnswer: String
    userAnswer: String
    mark: Float
    created: Date
    modified: Date
    finished: Boolean
    tutorComment: String
  }
`;

const queryText = `
  exercise(id: String, userId: String): Exercise
  practicalSolutions(semesterId: String, practicalId: String, userId: String): [Solution]
  markingSolutions(semesterId: String, practicalId: String, lastModification: Date, userId: String): [Solution]
`;

const queries = {
  exercise(root: any, { id }: any, { user, userId }: Apollo.IApolloContext): Cs.Collections.IExerciseDAO {
    if (!user) {
      return null;
    }
    return Exercises.findOne({ _id: id });
  },
  markingSolutions(root: any, { semesterId, practicalId, lastModification }: any, { user }: Apollo.IApolloContext): Cs.Collections.ISolutionDAO[] {
    if (!user || user.roles.indexOf('tutor') === -1) {
      return [];
    }
    console.log(lastModification);
    return Solutions.find({ semesterId, practicalId, modified: { $gt: lastModification } }).fetch();
  },
  practicalSolutions(root: any, { semesterId, practicalId }: any, { userId, user }: Apollo.IApolloContext): Cs.Collections.ISolutionDAO[] {
    const options = { fields: { expectedAnswer: 0 } };
    return Solutions.find({ userId, semesterId, practicalId }, options).fetch();
  }
};

const mutationText = `
  mark(solutionIds: [String]!, comments: [String]!, marks: [Float]!): Boolean
  save(exercise: ExerciseInput): Boolean
`;

interface IActionAnswer {
  solutionIds: string[];
  userAnswers: string[];
  finished: boolean;
}

interface IActionMark {
  solutionIds: string[];
  comments: string[];
  marks: number[];
}

interface IActionSave {
  exercise: Cs.Entities.IExercise;
}

const mutations = {
  mark(root: any, { solutionIds, comments, marks }: IActionMark, { user, userId }: Apollo.IApolloContext) {
    // check for tutor
    if (!user.roles.find((r) => r === 'tutor')) {
      return;
    }

    let total = 0;
    for (let i = 0; i < solutionIds.length; i++) {
      let cm = marks[i] ? marks[i] : 0;
      Solutions.update({ _id: solutionIds[i] }, {
        $set: {
          mark: cm,
          tutorComment: comments[i]
        }
      });
    }
  },
  save(root: any, { exercise }: IActionSave, { user }: Apollo.IApolloContext) {
    if (!user.roles.find((r) => r === 'tutor')) {
      return;
    }

    // first update the exercise 
    Exercises.update({ _id: exercise._id }, {
      $set: {
        name: exercise.name,
        instructions: exercise.instructions,
        group: exercise.group,
        questions: exercise.questions.map((e) => e._id)
      }
    });

    // then update all questions
    for (let question of exercise.questions) {
      Questions.upsert({ _id: question._id }, { $set: question });
    }
  }
};

const resolvers = {
  Exercise: {
    questions(exercise: Cs.Collections.IExerciseDAO, params: any, { user }: Apollo.IApolloContext): Cs.Collections.IQuestionDAO[] {
      let options = {};
      if (!user.roles || user.roles.indexOf('tutor') === -1) {
        options = { fields: { expectedAnswer: 0, validation: 0, possibilities: 0 } };
      }
      return Questions.find({ _id: { $in: exercise.questions } }, options).fetch();
    }
  },
  Question: {
    possibilities(question: Cs.Collections.IQuestionDAO): Cs.Collections.IQuestionPossibilityDAO[] {
      if (question.possibilitiesGroupId) {
        return Possibilities.findOne({ _id: question.possibilitiesGroupId }).possibilities;
      } else {
        return null;
      }
    }
  }
};

const definition: IApolloDefinition = {
  schema,
  resolvers,
  queries,
  queryText,
  mutationText,
  mutations
};

export default definition;
```

## Generating schemas<a name="generation" id="generation"></a>

This is how you can generate a schema for Apollo Server

```js
import { processSchema } from 'apollo-mantra/server';

// process all

import practical from './practical_schema';
import exercise from './exercise_schema';
import root from './root_schema';

export default function() {
  processSchema([
    date,
    user,
    exercise,
    practical,
    semester,
    root
  ]);

  return {
    schema: schemas(),
    resolvers: resolvers()
  }
}
```

## Server configuration<a name="generation" id="generation"></a>

This is how you can configure your Apollo Server using our helpers. The `createSchemas` is the function exported from the [previous example](#generation)

```typescript
import { createApolloServer } from 'meteor/apollo';
import { schemas, resolvers } from 'apollo-mantra/server';
import createSchemas from '../data/schemas/index';

declare global {
  namespace Apollo {
    export interface IApolloContext {
      user: Cs.Accounts.SystemUser;
      userId: string;
    }
  }
}

export default function() {
  const schemas = createSchemas(); 

  createApolloServer({
    graphiql: true,
    pretty: true,
    schema: schemas.schema,
    resolvers: schemas.resolvers,
  });
}
```

## Reducer<a name="reducer" id="reducer"></a>

This is how you can copy apollo query results to the store. 

```js
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
