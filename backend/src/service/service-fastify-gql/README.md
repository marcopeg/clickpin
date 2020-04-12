# Fastify GraphQL

## Extend the schema:

Add a new custom scalar type:

```js
registerAction({
  hook: '$FASTIFY_GQL_EXTEND_SCHEMA',
  handler: () => ({
    typeDefs: gql`
      scalar Age
    `,
    resolvers: {
      Age: new GraphQLScalarType({
        name: 'Age',
        description: 'between 18 and 56.',
        parseValue: getAge,
        serialize: getAge,
        parseLiteral(ast) {
          if (ast.kind === Kind.INT) {
            if (!isValidAge(ast.value)) {
              throw new GraphQLError('Age must be between 18 and 60');
            }
            return getAge(ast.value);
          }
          return null;
        },
      }),
    },
  }),
});
```

Add new fields to queries or mutations:  
(Age comes from the previous extension)

```js
registerAction({
  hook: '$FASTIFY_GQL_EXTEND_SCHEMA',
  handler: () => ({
    typeDefs: gql`
      type Foo {
        a: Age!
        b: String!
      }

      extend type Query {
        foo: Foo!
      }
    `,
    resolvers: {
      Query: {
        foo: () => ({
          a: 22,
          b: 'y',
        }),
      },
    },
  }),
});
```
