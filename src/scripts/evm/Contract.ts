import { ContractInfos } from "../../contracts";
import { EvmChainId } from "../../types/ChainTypes";
import ScriptTypes, { PerInfo } from "../../types/ScriptTypes";
import erc20Abi from "../../contracts/abi/ERC20";

export const getValue = {
  description: "Read from the contract (value)",
  method: "eth_call",
  contractInfo: (chain: EvmChainId): Record<string, PerInfo> => ({
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
  description: "Read from the contract (value2)",
  method: "eth_call",
  contractInfo: (chain: EvmChainId): Record<string, PerInfo> => ({
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
  description: "Write with the contract method (value)",
  method: "eth_sendTransaction",
  contractInfo: (chain: EvmChainId): Record<string, PerInfo> => ({
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
  args: [{ placeholder: "value", value: 0 }],
};

export const setValue2 = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Write with the contract method (value2)",
  method: "eth_sendTransaction",
  contractInfo: (chain: EvmChainId): Record<string, PerInfo> => ({
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
  args: [{ placeholder: "value", value: "" }],
};

export const sendERC20Token = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Send ERC20 token",
  method: "eth_sendTransaction",
  contractInfo: (): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: "",
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(erc20Abi),
    },
    methodName: {
      comment: "method name",
      value: "transfer",
    },
  }),
  args: [
    { placeholder: "to", value: "" },
    { placeholder: "value", value: "" },
  ],
};

export const triggerError = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Trigger an error with the contract method",
  method: "eth_sendTransaction",
  contractInfo: (chain: EvmChainId): Record<string, PerInfo> => ({
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
  args: [
    { placeholder: "value (Input below 100 to trigger an error)", value: 0 },
  ],
};
