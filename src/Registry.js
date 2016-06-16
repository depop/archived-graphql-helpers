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

type connectionTypes = {
  connectionType: GraphQLObjectType,
  edgeType: GraphQLObjectType,
};

export default class Registry {
  types: {
    [key: string]: Object,
  };

  interfaces: {
    [key: string]: Object,
  };

  constructor() {
    this.types = {};
    this.interfaces = {};
    this.addType(GraphQLID);
    this.addType(GraphQLInt);
    this.addType(GraphQLBoolean);
    this.addType(GraphQLFloat);
    this.addType(GraphQLString);
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

  create(spec: string, resolvers: Object = {}, description: ?string): Object {
    const [built, builtType] = build(this, spec, resolvers, description);

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
