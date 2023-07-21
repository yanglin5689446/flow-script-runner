import { ContractInfos } from "../../contracts";
import { EvmTestChain } from "../../types/ChainTypes";
import ScriptTypes, { PerInfo } from "../../types/ScriptTypes";

export interface Params {
  account: string;
  contractAddress: string;
  contractAbi: string;
  methodName: string;
  args: any[];
}

export const getValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Read from the contract",
  method: "eth_call",
  contractInfo: (chain: EvmTestChain): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain].abi),
    },
    methodName: {
      comment: "method name",
      value: "value",
    },
  }),
  args: [],
};

export const getValue2 = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Read from the contract",
  method: "eth_call",
  contractInfo: (chain: EvmTestChain): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain].abi),
    },
    methodName: {
      comment: "method name",
      value: "value2",
    },
  }),
  args: [],
};

export const setValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Write with the contract method",
  method: "eth_sendTransaction",
  contractInfo: (chain: EvmTestChain): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain].abi),
    },
    methodName: {
      comment: "method name",
      value: "setValue",
    },
  }),
  args: [0],
};

export const setValue2 = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Write with the contract method",
  method: "eth_sendTransaction",
  contractInfo: (chain: EvmTestChain): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain].abi),
    },
    methodName: {
      comment: "method name",

      value: "setValue2",
    },
  }),
  args: [0],
};

export const triggerError = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Trigger an error with the contract method",
  method: "eth_sendTransaction",
  contractInfo: (chain: EvmTestChain): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain].abi),
    },
    methodName: {
      comment: "method name",
      value: "arithmeticError",
    },
  }),
  args: [0],
};
