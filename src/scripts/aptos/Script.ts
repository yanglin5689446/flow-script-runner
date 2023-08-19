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
    is_view: {
      comment: "Whether the function is a view function or not",
      value: "false",
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
    { type: AptosArgTypes.U64, comment: "value", name: "value" },
  ],
};

export const sendArgumentsnScript = {
  type: ScriptTypes.SCRIPT,
  script: "",
  description:
    "Send all kinds of arguments to the contract by sending a script payload transaction",
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
        "0xa11ceb0b0600000007010004020404030805050d1d072a270851400691011c00000101000207000103020100090c01020304050a020a020800000a0c01020304050a020a020a03080006737472696e670b68656c6c6f5f776f726c6406537472696e670c646f67655f69735f646f70650000000000000000000000000000000000000000000000000000000000000001a26e3022851b55cc2d669a937d8c9eb934640f4240664e8b3c91e81cade386a40a0319030100000000000000020000000000000003000000000000000000010c0b000b010b020b030b040b050b060b0707000b08110002",
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
    is_view: {
      comment: "Whether the function is a view function or not",
      value: "false",
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
        '["signer", "bool", "u8", "u64", "u128", "address", "vector<u8>", "vector<u8>", "0x1::string::String"]',
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
      type: AptosArgTypes.U8,
      comment: "u8",
      name: "u8",
      value: "123",
    },
    {
      type: AptosArgTypes.U64,
      comment: "u64",
      name: "u64",
      value: "123",
    },
    {
      type: AptosArgTypes.U128,
      comment: "u128",
      name: "u128",
      value: "123",
    },
    {
      type: AptosArgTypes.Address,
      comment: "address",
      name: "address",
      value:
        "0xdb0811ac77320edb8a76520cea79af8850d2e9ca56f6cbf81dbbfd1279abe99a",
    },
    {
      type: AptosArgTypes.String,
      comment: "vector<u8> (plain text)",
      name: "vector<u8> (plain text)",
      value: "abcde",
    },
    {
      type: AptosArgTypes.Array,
      comment: "vector<u8> (uint8 array)",
      name: "vector<u8> (uint8 array)",
      value: "[97, 98, 99, 100, 101]",
    },
    {
      type: AptosArgTypes.String,
      comment: "0x1::string::String",
      name: "0x1::string::String",
      value: "foo",
    },
  ],
};
