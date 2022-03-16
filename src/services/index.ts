import Web3 from "web3";
import BloctoSDK from "@blocto/sdk";
import { Chains, ChainsType, EvmChain, OtherChain } from "../types/ChainTypes";
import { web3 as bscWeb3, bloctoSDK as bscSDK } from "./bscTestnet";
import { web3 as fujiWeb3, bloctoSDK as fujiSDK } from "./fuji";
import { web3 as mumbaiWeb3, bloctoSDK as mumbaiSDK } from "./mumbai";
import {
  web3 as rinkebyWeb3,
  bloctoSDK as rinkebySDK,
  ExtendedBloctoSDK,
} from "./rinkeby";
import { bloctoSDK as solanaSDK } from "./solanaDevnet";

interface EvmChainInterface {
  web3: Web3;
  bloctoSDK: ExtendedBloctoSDK;
  address: string | null;
}

type EvmChainsInfoType = { [key in EvmChain]: EvmChainInterface };

interface OtherChainInterface {
  bloctoSDK?: BloctoSDK;
  address: string | null;
}

type OtherChainsInfoType = { [key in OtherChain]: OtherChainInterface };

interface ChainServicesInterface {
  getChainAddress: (chain: ChainsType) => string | null;
  setChainAddress: (chain: ChainsType, address: string) => void;
}

export const ChainServices: EvmChainsInfoType &
  OtherChainsInfoType &
  ChainServicesInterface = {
  [Chains.Flow]: { address: null },
  [Chains.Ethereum]: {
    web3: rinkebyWeb3,
    bloctoSDK: rinkebySDK,
    address: null,
  },
  [Chains.Bsc]: { web3: bscWeb3, bloctoSDK: bscSDK, address: null },
  [Chains.Polygon]: { web3: mumbaiWeb3, bloctoSDK: mumbaiSDK, address: null },
  [Chains.Avalanche]: { web3: fujiWeb3, bloctoSDK: fujiSDK, address: null },
  [Chains.Solana]: { bloctoSDK: solanaSDK, address: null },

  getChainAddress(chain) {
    return this[chain].address;
  },

  setChainAddress(chain, address) {
    this[chain].address = address;
  },
};
