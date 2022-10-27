import { ContractInfos } from "../../contracts";
import { ChainServices } from "../../services";
import { Chains, ChainsType, OtherChain } from "../../types/ChainTypes";
import ScriptTypes, {
  AptosArgTypes,
  AptosContractAbiKeys,
  Arg,
  PerContractInfo,
} from "../../types/ScriptTypes";

export const transferAptosCoin = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Transfer Aptos coin to other address",
  method: (
    contractInfo: {
      moduleName: {
        comment: string;
        value: string;
      };
      method: {
        comment: string;
        value: string;
      };
    },
    args: Record<string, any>
  ): Promise<any | { is_init: number; number: number }> => {
    return new Promise(async (resolve, reject) => {
      const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
      const typeArgs = args
        .filter((arg: any) => arg.type === "type_arg")
        .map((arg: any) => arg.value);
      const normalArgs = args
        .filter((arg: any) => arg.type !== "type_arg")
        .map((arg: any) => arg.value);
      const { moduleName, method } = contractInfo;
      const funcName = `${moduleName.value}::${method.value}`;
      const transaction = {
        arguments: normalArgs,
        function: funcName,
        type: "entry_function_payload",
        type_arguments: typeArgs,
      };

      try {
        const result = await aptos.signAndSubmitTransaction(transaction);
        resolve(result.hash);
      } catch (error) {
        reject(error);
      }
    });
  },
  contractInfo: (chain: ChainsType): Record<string, PerContractInfo> => ({
    moduleName: {
      comment: "module name",
      value: ContractInfos[chain as OtherChain.Aptos].moduleName,
    },
    method: {
      comment: "method",
      value: "transfer",
    },
  }),
  args: [
    {
      type: AptosArgTypes.TypeArg,
      comment: "coin type",
      value: "0x1::aptos_coin::AptosCoin",
    },
    { type: AptosArgTypes.Address, comment: "receipient", name: "receipient" },
    { type: AptosArgTypes.Number, comment: "value", name: "value" },
  ],
};

export const scriptPayload = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Transfer token by sending a script payload transaction",
  method: (
    contractInfo: { bytecode: PerContractInfo },
    args: Arg[],
    contractAbi: Record<AptosContractAbiKeys, PerContractInfo>
  ): Promise<any | { is_init: number; number: number }> => {
    return new Promise(async (resolve, reject) => {
      const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
      const typeArgs = args
        .filter((arg: any) => arg.type === "type_arg")
        .map((arg: any) => arg.value);
      const normalArgs = args
        .filter((arg: any) => arg.type !== "type_arg")
        .map((arg: any) => arg.value);
      const { bytecode } = contractInfo;
      const abi = Object.keys(contractAbi).reduce<Record<string, any>>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (initial, currentValue: AptosContractAbiKeys) => {
          initial[currentValue] = contractAbi[currentValue].format
            ? contractAbi[currentValue].format?.(
                contractAbi[currentValue].value
              )
            : contractAbi[currentValue].value;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contractInfo: (chain: ChainsType): Record<string, PerContractInfo> => ({
    bytecode: {
      comment: "Move script bytecode",
      value:
        "0xa11ceb0b0500000005010002030205050706070d170824200000000100010003060c0503000d6170746f735f6163636f756e74087472616e736665720000000000000000000000000000000000000000000000000000000000000001000001050b000b010b02110002",
    },
  }),
  contractAbi: {
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
    { type: AptosArgTypes.Address, comment: "receipient", name: "receipient" },
    { type: AptosArgTypes.Number, comment: "value", name: "value" },
  ],
};
