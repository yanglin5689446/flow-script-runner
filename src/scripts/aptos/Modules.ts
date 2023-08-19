import { ContractInfos } from "../../contracts";
import { ChainServices } from "../../services";
import { Chains } from "../../types/ChainTypes";
import ScriptTypes, { PerInfo, Arg } from "../../types/ScriptTypes";
import { MODULE_ARGS } from "./ModuleArgs";

interface EntryFunctionTx {
  arguments: Arg[] | undefined;
  function: string;
  type: string;
  type_arguments: any[] | undefined;
}

export const transferAptosCoin = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Transfer Aptos coin to other address",
  method: (
    transaction: EntryFunctionTx
  ): Promise<any | { is_init: number; number: number }> => {
    const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
    return aptos.signAndSubmitTransaction(transaction);
  },
  contractInfo: (): Record<string, PerInfo> => ({
    moduleName: {
      comment: "module name",
      value: "0x1::coin",
    },
    method: {
      comment: "method",
      value: "transfer",
    },
  }),
  args: MODULE_ARGS["transferAptosCoin"],
};

export const sendArguments = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description:
    "Send all kinds of arguments to the contract to see if it works as expected",
  method: (
    transaction: EntryFunctionTx
  ): Promise<any | { is_init: number; number: number }> => {
    const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
    return aptos.signAndSubmitTransaction(transaction);
  },
  contractInfo: (): Record<string, PerInfo> => ({
    moduleName: {
      comment: "module name",
      value: `${ContractInfos[Chains.Aptos].address}::hello_world`,
    },
    method: {
      comment: "method",
      value: "doge_is_dope",
    },
  }),
  args: MODULE_ARGS["sendArguments"],
};

export const mintNFT = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Mint Aptos v2 NFT",
  method: (
    transaction: EntryFunctionTx
  ): Promise<any | { is_init: number; number: number }> => {
    const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
    return aptos.signAndSubmitTransaction(transaction);
  },
  contractInfo: (): Record<string, PerInfo> => ({
    moduleName: {
      comment: "module name",
      value: `${ContractInfos[Chains.Aptos].address}::hero`,
    },
    method: {
      comment: "method",
      value: "mint",
    },
  }),
  args: MODULE_ARGS["mintNFT"],
};

export const sendTxWithNFT = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Send tx with object arguments",
  method: (
    transaction: EntryFunctionTx
  ): Promise<any | { is_init: number; number: number }> => {
    const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
    return aptos.signAndSubmitTransaction(transaction);
  },
  contractInfo: (): Record<string, PerInfo> => ({
    moduleName: {
      comment: "module name",
      value: `${ContractInfos[Chains.Aptos].address}::hero`,
    },
    method: {
      comment: "method",
      value: "summon_hero",
    },
  }),
  args: MODULE_ARGS["sendTxWithNFT"],
};

export const logGenerics = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Send tx with generic object arguments",
  method: (
    transaction: EntryFunctionTx
  ): Promise<any | { is_init: number; number: number }> => {
    const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
    return aptos.signAndSubmitTransaction(transaction);
  },
  contractInfo: (): Record<string, PerInfo> => ({
    moduleName: {
      comment: "module name",
      value: `${ContractInfos[Chains.Aptos].address}::hello_world`,
    },
    method: {
      comment: "method",
      value: "log_generics",
    },
  }),
  args: MODULE_ARGS["logGenerics"],
};

export const triggerError = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Trigger an error with the contract method",
  method: (
    transaction: EntryFunctionTx
  ): Promise<any | { is_init: number; number: number }> => {
    const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
    return aptos.signAndSubmitTransaction(transaction);
  },
  contractInfo: (): Record<string, PerInfo> => ({
    moduleName: {
      comment: "module name",
      value: `${ContractInfos[Chains.Aptos].address}::hello_world`,
    },
    method: {
      comment: "method",
      value: "arithmetic_error_entry",
    },
  }),
  args: MODULE_ARGS["triggerError"],
};
