/* @flow */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import buildType from './builders/buildType';

class Registry {
  types: {
    [key: string]: Object,
  };

  interfaces: {
    [key: string]: Object,
  };

  constructor() {
    this.types = {};
    this.interfaces = {};
  }

  addType(obj: Object): void {
    this.types[obj.name] = obj;
  }

  addInterface(obj: Object): void {
    this.interfaces[obj.name] = obj;
  }

  addConnection(types: connectionTypes): void {
    this.addType(types.connectionType);
    this.addType(types.edgeType);
  }

  createType(spec: string, resolvers: Object = {}, description: ?string): Object {
    const newType = buildType(this, spec, resolvers, description);
    this.addType(newType);
    return newType;
  }

  getType(name: string): Object {
    return this.types[name];
  }

  getInterface(name: string): Object {
    return this.interfaces[name];
  }
}

const registry = new Registry();

registry.addType(GraphQLID);
registry.addType(GraphQLInt);
registry.addType(GraphQLBoolean);
registry.addType(GraphQLFloat);
registry.addType(GraphQLString);


export default registry;
