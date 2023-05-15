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

export interface SignMessagePayload {
  address?: boolean; // Should we include the address of the account in the message
  application?: boolean; // Should we include the domain of the dapp
  chainId?: boolean; // Should we include the current chain id the wallet is connected to
  message: string; // The message to be signed and displayed to the user
  nonce: string; // A nonce the dapp should generate
}
