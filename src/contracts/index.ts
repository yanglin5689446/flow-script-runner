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
  contractAbi as rinkebyContractAbi,
  contractAddress as rinkebyContractAddress,
} from "./rinkeby";
import { programId, accountPubKey } from "./solanaDevnet";
import { EvmChain, OtherChain } from "../types/ChainTypes";

type ContractInfosType = {
  [OtherChain.Solana]: { programId: string; accountPubKey: string };
} & {
  [key in EvmChain]: { abi: AbiItem[] | AbiItem; address: string };
};

export const ContractInfos: ContractInfosType = {
  [EvmChain.Ethereum]: {
    abi: rinkebyContractAbi,
    address: rinkebyContractAddress,
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
  [OtherChain.Solana]: {
    programId,
    accountPubKey,
  },
};
