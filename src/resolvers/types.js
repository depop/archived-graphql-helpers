export type ResolverFn = (obj: ?Object, args: ?Object, context: ?Object, rootValue: ?Object) => ?any | Promise<?any>;
export type ResolveTypeFn = (obj: ?Object) => GraphQLType;
