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
  U8 = "u8",
  U16 = "u16",
  U32 = "u32",
  U64 = "u64",
  U128 = "u128",
  U256 = "u256",
  Bool = "boolean",
  Bytes = "bytes",
  Array = "array  (vector)",
  Object = "object",
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
