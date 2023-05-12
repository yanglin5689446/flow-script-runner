import { AbiItem } from "web3-utils";
import {
  contractAbi as bscContractAbi,
  contractAddress as bscContractAddress,
} from "./bsc";
import {
  contractAbi as fujiContractAbi,
  contractAddress as fujiContractAddress,
} from "./fuji";
import {
  contractAbi as mumbaiContractAbi,
  contractAddress as mumbaiContractAddress,
} from "./mumbai";
import {
  contractAbi as goerliContractAbi,
  contractAddress as goerliContractAddress,
} from "./goerli";
import {
  contractAbi as arbitrumContractAbi,
  contractAddress as arbitrumContractAddress,
} from "./arbitrum";
import {
  contractAbi as optimismContractAbi,
  contractAddress as optimismContractAddress,
} from "./optimism";
import { programId, accountPubKey } from "./solanaDevnet";
import { moduleName } from "./aptosDevnet";
import { EvmChain, OtherChain } from "../types/ChainTypes";

type ContractInfosType = {
  [OtherChain.Solana]: { programId: string; accountPubKey: string };
  [OtherChain.Aptos]: { moduleName: string };
} & {
  [key in EvmChain]: { abi: AbiItem[] | AbiItem; address: string };
};

export const ContractInfos: ContractInfosType = {
  [EvmChain.Ethereum]: {
    abi: goerliContractAbi,
    address: goerliContractAddress,
  },
  [EvmChain.Bsc]: {
    abi: bscContractAbi,
    address: bscContractAddress,
  },
  [EvmChain.Polygon]: {
    abi: mumbaiContractAbi,
    address: mumbaiContractAddress,
  },
  [EvmChain.Avalanche]: {
    abi: fujiContractAbi,
    address: fujiContractAddress,
  },
  [EvmChain.Arbitrum]: {
    abi: arbitrumContractAbi,
    address: arbitrumContractAddress,
  },
  [EvmChain.Optimism]: {
    abi: optimismContractAbi,
    address: optimismContractAddress,
  },
  [OtherChain.Solana]: {
    programId,
    accountPubKey,
  },
  [OtherChain.Aptos]: {
    moduleName,
  },
};
