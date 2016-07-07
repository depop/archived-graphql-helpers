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
} from 'graphql';

import build from './builders/build';

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

export default class Registry {
  middleware: Object;

  types: {
    [key: string]: Object,
  };

  interfaces: {
    [key: string]: Object,
  };

  constructor(middleware: ?Middleware = null) {
    middleware;
    this.types = {};
    this.interfaces = {};
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
  }

  addType(obj: Object): void {
    this.types[obj.name] = obj;
  }

  addInterface(obj: Object): void {
    this.interfaces[obj.name] = obj;
    this.types[obj.name] = obj;
  }

  addConnection(types: connectionTypes): void {
    this.addType(types.connectionType);
    this.addType(types.edgeType);
  }

  create(spec: string, resolvers: Object = {}): Object {
    const [built, builtType] = build(this, spec, resolvers);

    if (builtType === 'ObjectTypeDefinition') {
      this.addType(built);
    } else if (builtType === 'InterfaceTypeDefinition'){
      this.addInterface(built);
    }
    return built;
  }

  getType(name: string): Object {
    return this.types[name];
  }

  getInterface(name: string): Object {
    return this.interfaces[name];
  }
}
