/* @flow */

import type {
  GraphQLObjectType,
} from 'graphql';

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  parse,
} from 'graphql';

import type { GraphQLFieldConfigMap } from 'graphql/type/definition';

import type { Thunk } from './functools';

import * as builders from './builders';
import mergeTypes from './builders/mergeTypes';

const identity = obj => obj;

type connectionTypes = {
  connectionType: GraphQLObjectType,
  edgeType: GraphQLObjectType,
};

type Middleware = {
  wrapInputType: (inputType: Object) => Object,
  wrapInputTypeFields: (fieldThunk: Object) => Object,
  wrapType: (type: Object) => Object,
  wrapTypeFields: (fieldThunk: Object) => Object,
};

const parseSpec = spec => {
  try {
    const ast = parse(spec);

    if (ast.definitions.length !== 1) {
      throw new Error(`Documents must contain exactly one definition (found: ${ast.definitions.length})`);
    }
    return ast.definitions[0];
  } catch (error) {
    throw new Error(`Couldn't parse spec: ${spec}`);
  }
};


export default class Registry {
  middleware: Object;

  _wrapTypeFields: (thunk: Thunk) => GraphQLFieldConfigMap;
  _wrapMutations: (mutationsType: Object) => Object;

  types: {
    [key: string]: Object,
  };

  interfaces: {
    [key: string]: Object,
  };

  mutations: Array<Object>;

  constructor(middleware: ?Middleware = null) {
    middleware;
    this.types = {};
    this.interfaces = {};
    this.mutations = [];
    this.addType(GraphQLID);
    this.addType(GraphQLInt);
    this.addType(GraphQLBoolean);
    this.addType(GraphQLFloat);
    this.addType(GraphQLString);

    if (middleware && middleware.wrapTypeFields) {
      this._wrapTypeFields = middleware.wrapTypeFields;
    } else {
      this._wrapTypeFields = identity;
    }

    if (middleware && middleware.wrapMutations) {
      this._wrapMutations = middleware.wrapMutations;
    } else {
      this._wrapMutations = identity;
    }
  }

  addType(obj: Object): void {
    this.types[obj.name] = obj;
  }

  buildType(spec: string, resolvers: Object = {}): Object {
    return builders.buildType(this, parseSpec(spec), resolvers);
  }

  createType(spec: string, resolvers: Object = {}): Object {
    const built = builders.buildType(this, parseSpec(spec), resolvers);
    this.addType(built);
    return built;
  }

  addInterface(obj: Object): void {
    this.interfaces[obj.name] = obj;
    this.types[obj.name] = obj;
  }

  buildInterface(spec: string, resolveType): Object {
    return builders.buildInterface(this, parseSpec(spec), resolveType);
  }

  createInterface(spec: string, resolveType): Object {
    const built = builders.buildInterface(this, parseSpec(spec), resolveType);
    this.addInterface(built);
    return built;
  }

  addConnection(types: connectionTypes): void {
    this.addType(types.connectionType);
    this.addType(types.edgeType);
  }

  getType(name: string): Object {
    return this.types[name];
  }

  getInterface(name: string): Object {
    return this.interfaces[name];
  }

  addMutations(mutations: Object): void {
    this.mutations = [...this.mutations, mutations];
  }

  createMutations(spec: string, resolvers: Object = {}) {
    const built = this._wrapMutations(builders.buildType(this, parseSpec(spec), resolvers));
    this.addMutations(built);
    return built;
  }

  getMutationType() {
    /* Returns a merged aggregate type of all registered mutations */
    return mergeTypes('Mutation', ...this.mutations);
  }
}
