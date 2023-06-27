enum ScriptTypes {
  SCRIPT,
  TX,
  CONTRACT,
  SIGN,
  RESOURCE,
  USER_OPERATION,
}

export default ScriptTypes;

export interface Arg {
  value?: any;
  type: any;
  comment?: string;
  name?: string;
  required?: boolean;
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
  Bytes = "bytes",
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
