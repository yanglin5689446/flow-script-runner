enum ScriptTypes {
  SCRIPT,
  TX,
  CONTRACT,
  SIGN,
  RESOURCE,
}

export default ScriptTypes;

export interface Arg {
  value?: any;
  type: any;
  comment?: string;
  name?: string;
}

export enum ArgTypes {
  TypeArg = "type_arg",
  Address = "address",
  String = "string",
  Number = "number",
}

export interface PerContractInfo {
  value?: string;
  comment?: string;
}
