import { ChainServices } from "../../services";
import { Chains } from "../../types/ChainTypes";
import ScriptTypes, {
  AptosArgTypes,
  AptosScriptAbiKeys,
  Arg,
  PerInfo,
  PerScriptAbi,
} from "../../types/ScriptTypes";

export const transferTokenScript = {
  type: ScriptTypes.SCRIPT,
  script: "",
  description: "Transfer token by sending a script payload transaction",
  method: (
    scriptInfo: { bytecode: PerInfo },
    args: Arg[],
    scriptAbi: Record<AptosScriptAbiKeys, PerScriptAbi>
  ): Promise<any | { is_init: number; number: number }> => {
    return new Promise(async (resolve, reject) => {
      const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
      const typeArgs = args
        .filter((arg: any) => arg.type === "type_arg")
        .map((arg: any) => arg.value);
      const normalArgs = args
        .filter((arg: any) => arg.type !== "type_arg")
        .map((arg: any) =>
          arg.type === AptosArgTypes.Array ? JSON.parse(arg.value) : arg.value
        );
      const { bytecode } = scriptInfo;
      const abi = Object.keys(scriptAbi).reduce<Record<string, any>>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (initial, currentValue: AptosScriptAbiKeys) => {
          initial[currentValue] = scriptAbi[currentValue].format
            ? scriptAbi[currentValue].format?.(scriptAbi[currentValue].value)
            : scriptAbi[currentValue].value;
          return initial;
        },
        {}
      );
      const transaction = {
        type: "script_payload",
        code: { bytecode: bytecode.value, abi },
        type_arguments: typeArgs,
        arguments: normalArgs,
      };
      try {
        const result = await aptos.signAndSubmitTransaction(transaction);
        resolve(result.hash);
      } catch (error) {
        reject(error);
      }
    });
  },
  scriptInfo: {
    bytecode: {
      comment: "Move script bytecode",
      value:
        "0xa11ceb0b0500000005010002030205050706070d170824200000000100010003060c0503000d6170746f735f6163636f756e74087472616e736665720000000000000000000000000000000000000000000000000000000000000001000001050b000b010b02110002",
    },
  },
  scriptAbi: {
    name: {
      comment: "Move function name",
      value: "main",
    },
    visibility: {
      comment: "Move function visibility (private / public / friend)",
      value: "public",
    },
    is_entry: {
      comment:
        "Whether the function can be called as an entry function directly in a transaction",
      value: "true",
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => value.toLowerCase() === "true",
    },
    generic_type_params: {
      comment: "Generic type params associated with the Move function",
      value: "[]",
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => (value ? JSON.parse(value) : []),
    },
    params: {
      comment: "Parameters associated with the move function",
      value: '["&signer", "address", "u64"]',
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => (value ? JSON.parse(value) : []),
    },
    return: {
      comment: "Return type of the function",
      value: "[]",
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => (value ? JSON.parse(value) : []),
    },
  },
  args: [
    { type: AptosArgTypes.Address, comment: "recipient", name: "recipient" },
    { type: AptosArgTypes.Number, comment: "value", name: "value" },
  ],
};

export const sendArgumentcript = {
  type: ScriptTypes.SCRIPT,
  script: "",
  description: "send argument test by sending a script payload transaction",
  method: (
    scriptInfo: { bytecode: PerInfo },
    args: Arg[],
    scriptAbi: Record<AptosScriptAbiKeys, PerScriptAbi>
  ): Promise<any | { is_init: number; number: number }> => {
    return new Promise(async (resolve, reject) => {
      const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
      const typeArgs = args
        .filter((arg: any) => arg.type === "type_arg")
        .map((arg: any) => arg.value);
      const normalArgs = args
        .filter((arg: any) => arg.type !== "type_arg")
        .map((arg: any) =>
          arg.type === AptosArgTypes.Array ? JSON.parse(arg.value) : arg.value
        );
      const { bytecode } = scriptInfo;
      const abi = Object.keys(scriptAbi).reduce<Record<string, any>>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (initial, currentValue: AptosScriptAbiKeys) => {
          initial[currentValue] = scriptAbi[currentValue].format
            ? scriptAbi[currentValue].format?.(scriptAbi[currentValue].value)
            : scriptAbi[currentValue].value;
          return initial;
        },
        {}
      );
      const transaction = {
        type: "script_payload",
        code: { bytecode: bytecode.value, abi },
        type_arguments: typeArgs,
        arguments: normalArgs,
      };
      try {
        const result = await aptos.signAndSubmitTransaction(transaction);
        resolve(result.hash);
      } catch (error) {
        reject(error);
      }
    });
  },
  scriptInfo: {
    bytecode: {
      comment: "Move script bytecode",
      value:
        "0xa11ceb0b0500000006010006020604030a0a051426073a35086f6000000101020200030700010403010002050402000b0c0c01020304050a020a020a020800010a0300010a020a0c01020304050a020a020a03080006737472696e67057574696c730b68656c6c6f5f776f726c6406537472696e6707746f5f753634730c646f67655f69735f646f70650000000000000000000000000000000000000000000000000000000000000001453da6fd658eef417b758a9d4263a70edd527ddc204357b3cb97635d3d4d2a25db0811ac77320edb8a76520cea79af8850d2e9ca56f6cbf81dbbfd1279abe99a0000010f0b0911000c0b0b010b020b030b040b050b060b070b080b0b0b0a110102",
    },
  },
  scriptAbi: {
    name: {
      comment: "Move function name",
      value: "main",
    },
    visibility: {
      comment: "Move function visibility (private / public / friend)",
      value: "public",
    },
    is_entry: {
      comment:
        "Whether the function can be called as an entry function directly in a transaction",
      value: "true",
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => value.toLowerCase() === "true",
    },
    generic_type_params: {
      comment: "Generic type params associated with the Move function",
      value: "[]",
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => (value ? JSON.parse(value) : []),
    },
    params: {
      comment: "Parameters associated with the move function",
      value:
        '["signer","signer","bool","u8","u64","u128","address","vector<u8>","vector<u8>","vector<u8>","0x1::string::String"]',
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => (value ? JSON.parse(value) : []),
    },
    return: {
      comment: "Return type of the function",
      value: "[]",
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      format: (value: any) => (value ? JSON.parse(value) : []),
    },
  },
  args: [
    {
      type: AptosArgTypes.Bool,
      comment: "bool",
      name: "bool",
      value: "false",
    },
    {
      type: AptosArgTypes.Number,
      comment: "u8",
      name: "u8",
      value: "123",
    },
    {
      type: AptosArgTypes.String,
      comment: "u64",
      name: "u64",
      value: "123",
    },
    {
      type: AptosArgTypes.String,
      comment: "u128",
      name: "u128",
      value: "123",
    },
    {
      type: AptosArgTypes.Address,
      comment: "address",
      name: "address",
      value:
        "0x9becff295121cff8434a68f263501f719f163f5c3628f928dc685c3e15e1ee1a",
    },
    {
      type: AptosArgTypes.String,
      comment: "vector<u8> - plain text",
      name: "u128",
      value: "abcde",
    },
    {
      type: AptosArgTypes.Array,
      comment: "vector<u8> - uint8 array",
      name: "u128",
      value: "[97, 98, 99, 100, 101]",
    },
    {
      type: AptosArgTypes.Array,
      comment: "vector<u64>",
      name: "u128",
      value: "[1,2,3]",
    },
    {
      type: AptosArgTypes.String,
      comment: "0x1::string::String",
      name: "0x1::string::String",
      value: "foo",
    },
  ],
};
