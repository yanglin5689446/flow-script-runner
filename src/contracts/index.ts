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
import { OtherChain, EvmTestChain } from "../types/ChainTypes";

type ContractInfosType = {
  [OtherChain.Solana]: { programId: string; accountPubKey: string };
  [OtherChain.Aptos]: { moduleName: string };
} & {
  [key in EvmTestChain]: { abi: AbiItem[] | AbiItem; address: string };
};

export const ContractInfos: ContractInfosType = {
  "0x5": {
    abi: goerliContractAbi,
    address: goerliContractAddress,
  },
  "0x61": {
    abi: bscContractAbi,
    address: bscContractAddress,
  },
  "0x13881": {
    abi: mumbaiContractAbi,
    address: mumbaiContractAddress,
  },
  "0xa869": {
    abi: fujiContractAbi,
    address: fujiContractAddress,
  },
  "0x66eed": {
    abi: arbitrumContractAbi,
    address: arbitrumContractAddress,
  },
  "0x01a4": {
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
