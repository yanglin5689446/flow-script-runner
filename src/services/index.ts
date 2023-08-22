import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Chains, ChainsType, EvmChain, OtherChain } from "../types/ChainTypes";
import { web3, bloctoSDK as evmSDK, ExtendedEvmBloctoSDK } from "./evm";
import { bloctoSDK as aptosSDK, ExtendedAptosBloctoSDK } from "./aptosTestnet";

type FlowInfoType = {
  [OtherChain.Flow]: {
    address: string | null;
  };
};

interface EvmChainInterface {
  web3: Web3;
  bloctoSDK: ExtendedEvmBloctoSDK;
  address: string | null;
  contract: Contract | null;
}

type AptosInfoType = {
  [OtherChain.Aptos]: {
    bloctoSDK: ExtendedAptosBloctoSDK;
    address: string | null;
  };
};

type EvmChainsInfoType = { [EvmChain.Ethereum]: EvmChainInterface };

interface ChainServicesInterface {
  getChainAddress: (chain: ChainsType) => string | null;
  setChainAddress: (chain: ChainsType, address: string) => void;
}

type ChainServicesType = FlowInfoType &
  EvmChainsInfoType &
  AptosInfoType &
  ChainServicesInterface;

export const ChainServices: ChainServicesType = {
  [Chains.Flow]: { address: null },
  [Chains.Ethereum]: {
    web3,
    bloctoSDK: evmSDK,
    address: null,
    contract: null,
  },
  [Chains.Aptos]: { bloctoSDK: aptosSDK, address: null },

  getChainAddress(chain) {
    return this[chain].address;
  },

  setChainAddress(chain, address) {
    this[chain].address = address;
  },
};
