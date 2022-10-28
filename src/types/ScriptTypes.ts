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
  String = "string",
  Number = "number",
}

export enum AptosArgTypes {
  TypeArg = "type_arg",
  Address = "address",
  String = "string",
  Number = "number",
  Bool = "boolean",
}

export interface PerInfo {
  value?: string;
  comment?: string;
}

export interface PerScriptAbi {
  value?: string;
  comment?: string;
  format?: (value: any) => any;
}

export type AptosScriptAbiKeys =
  | "name"
  | "visibility"
  | "is_entry"
  | "generic_type_params"
  | "params"
  | "return";
