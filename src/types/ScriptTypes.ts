enum ScriptTypes {
  SCRIPT,
  TX,
  SIGN,
  CONTRACT,
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

export interface PerContractInfo {
  value?: string;
  comment?: string;
}
