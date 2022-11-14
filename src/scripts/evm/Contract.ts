import { ContractInfos } from "../../contracts";
import { ChainServices } from "../../services";
import { ChainsType, EvmChain } from "../../types/ChainTypes";
import ScriptTypes, { ArgTypes, PerInfo } from "../../types/ScriptTypes";

interface Params {
  account: string;
  contractAddress: string;
  contractAbi: string;
  methodName: string;
  args: any[];
  chain: EvmChain;
}

export const getValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Read from the contract",
  method: ({
    contractAddress,
    contractAbi,
    methodName,
    chain,
  }: Params): Promise<string> => {
    let contract = ChainServices.getEvmChainContract(chain);
    if (contractAddress && contractAbi) {
      contract = new ChainServices[chain].web3.eth.Contract(
        JSON.parse(contractAbi),
        contractAddress
      );
    }
    return contract.methods[methodName || "value"]().call();
  },
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain as EvmChain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain as EvmChain].abi),
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
  method: ({
    contractAddress,
    contractAbi,
    methodName,
    chain,
  }: Params): Promise<string> => {
    let contract = ChainServices.getEvmChainContract(chain);
    if (contractAddress && contractAbi) {
      contract = new ChainServices[chain].web3.eth.Contract(
        JSON.parse(contractAbi),
        contractAddress
      );
    }
    return contract.methods[methodName || "value2"]().call();
  },
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain as EvmChain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain as EvmChain].abi),
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
  method: ({
    account,
    contractAddress,
    contractAbi,
    methodName,
    args,
    chain,
  }: Params): Promise<any> => {
    let contract = ChainServices.getEvmChainContract(chain);
    if (contractAddress && contractAbi) {
      contract = new ChainServices[chain].web3.eth.Contract(
        JSON.parse(contractAbi),
        contractAddress
      );
    }
    return contract.methods[methodName || "setValue"](...args).send({
      from: account,
    });
  },
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain as EvmChain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain as EvmChain].abi),
    },
    methodName: {
      comment: "method name",
      value: "setValue",
    },
  }),
  args: [{ type: ArgTypes.Number, comment: "value(number)", name: "value" }],
};

export const setValue2 = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Write with the contract method",
  method: ({
    account,
    contractAddress,
    contractAbi,
    methodName,
    args,
    chain,
  }: Params): Promise<any> => {
    let contract = ChainServices.getEvmChainContract(chain);
    if (contractAddress && contractAbi) {
      contract = new ChainServices[chain].web3.eth.Contract(
        JSON.parse(contractAbi),
        contractAddress
      );
    }
    return contract.methods[methodName || "setValue2"](...args).send({
      from: account,
    });
  },
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain as EvmChain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain as EvmChain].abi),
    },
    methodName: {
      comment: "method name",

      value: "setValue2",
    },
  }),
  args: [{ type: ArgTypes.Number, comment: "value2(number)", name: "value" }],
};

export const triggerError = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Trigger an error with the contract method",
  method: ({
    account,
    contractAddress,
    contractAbi,
    methodName,
    args,
    chain,
  }: Params): Promise<any> => {
    let contract = ChainServices.getEvmChainContract(chain);
    if (contractAddress && contractAbi) {
      contract = new ChainServices[chain].web3.eth.Contract(
        JSON.parse(contractAbi),
        contractAddress
      );
    }
    return contract.methods[methodName || "arithmeticError"](...args).send({
      from: account,
    });
  },
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
    contractAddress: {
      comment: "contract address",
      value: ContractInfos[chain as EvmChain].address,
    },
    contractAbi: {
      comment: "contract abi",
      value: JSON.stringify(ContractInfos[chain as EvmChain].abi),
    },
    methodName: {
      comment: "method name",

      value: "arithmeticError",
    },
  }),
  args: [{ type: ArgTypes.Number, comment: "a(number)", name: "a" }],
};
