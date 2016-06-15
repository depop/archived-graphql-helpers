/* @flow */

type specASTType = {
  name: string,
  isList: boolean,
};

type specASTArg = {
  name: string,
  type: specASTType,
  required: boolean,
};

type specASTField = {
  name: string,
  args: Array<specASTArg>,
  type: specASTType,
  required: boolean,
};

export type specAST = {
  type: 'type' | 'interface',
  name: string,
  implements: Array<string>,
  fields: Array<specASTField>,
}
