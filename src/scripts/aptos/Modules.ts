import { ContractInfos } from "../../contracts";
import { ChainServices } from "../../services";
import { Chains, ChainsType, OtherChain } from "../../types/ChainTypes";
import ScriptTypes, { AptosArgTypes, PerInfo } from "../../types/ScriptTypes";

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
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
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
    { type: AptosArgTypes.Address, comment: "recipient", name: "recipient" },
    { type: AptosArgTypes.Number, comment: "value", name: "value" },
  ],
};
export const triggerError = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Trigger an error with the contract method",
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
      const funcName = `0x9b5d846cbf4791539914a41d8f3067937009421bf2b33ca499612b48f5aa1dd1::${moduleName.value}::${method.value}`;
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
  contractInfo: (): Record<string, PerInfo> => ({
    moduleName: {
      comment: "module name",
      value: "test",
    },
    method: {
      comment: "method",
      value: "arithmetic_error_entry",
    },
  }),
  args: [
    {
      type: AptosArgTypes.Number,
      comment: "Input below 100 can trigger an error",
      name: "value",
    },
  ],
};
