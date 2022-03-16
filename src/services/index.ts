import Web3 from "web3";
import { EvmChain } from "../types/ChainTypes";
import { web3 as bscWeb3, bloctoSDK as bscSDK } from "./bscTestnet";
import { web3 as fujiWeb3, bloctoSDK as fujiSDK } from "./fuji";
import { web3 as mumbaiWeb3, bloctoSDK as mumbaiSDK } from "./mumbai";
import {
  web3 as rinkebyWeb3,
  bloctoSDK as rinkebySDK,
  ExtendedBloctoSDKInterface,
} from "./rinkeby";

interface ChainInterface {
  web3: Web3;
  bloctoSDK: ExtendedBloctoSDKInterface;
  address: string | null;
}

type ChainsInfoType = { [key in EvmChain]: ChainInterface };

interface ChainServicesInterface {
  getChainAddress: (chain: EvmChain) => string | null;
  setChainAddress: (chain: EvmChain, address: string) => void;
}

export const ChainServices: ChainsInfoType & ChainServicesInterface = {
  [EvmChain.Ethereum]: {
    web3: rinkebyWeb3,
    bloctoSDK: rinkebySDK,
    address: null,
  },
  [EvmChain.Bsc]: { web3: bscWeb3, bloctoSDK: bscSDK, address: null },
  [EvmChain.Polygon]: { web3: mumbaiWeb3, bloctoSDK: mumbaiSDK, address: null },
  [EvmChain.Avalanche]: { web3: fujiWeb3, bloctoSDK: fujiSDK, address: null },

  getChainAddress(chain: EvmChain) {
    return this[chain].address;
  },

  setChainAddress(chain: EvmChain, address: string): void {
    this[chain].address = address;
  },
};
