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
        .map((arg: any) => arg.value);
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
