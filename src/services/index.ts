import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { struct, u8, u32, UInt, Structure } from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
import { ContractInfos } from "../contracts";
import { Chains, ChainsType, EvmChain, OtherChain } from "../types/ChainTypes";
import { web3 as bscWeb3, bloctoSDK as bscSDK } from "./bscTestnet";
import { web3 as fujiWeb3, bloctoSDK as fujiSDK } from "./fuji";
import { web3 as arbitrumWeb3, bloctoSDK as arbitrumSDK } from "./arbitrum";
import { web3 as optimismWeb3, bloctoSDK as optimismSDK } from "./optimism";
import { web3 as mumbaiWeb3, bloctoSDK as mumbaiSDK } from "./mumbai";
import {
  web3 as rinkebyWeb3,
  bloctoSDK as rinkebySDK,
  ExtendedEvmBloctoSDK,
} from "./rinkeby";
import {
  bloctoSDK as solanaSDK,
  ExtendedSolaneBloctoSDK,
} from "./solanaDevnet";
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

type EvmChainsInfoType = { [key in EvmChain]: EvmChainInterface };

interface SolanaProgramInfo {
  programId: PublicKey;
  accountPubKey: PublicKey;
  programLayout: Structure<UInt>;
}
type SolanaInfoType = {
  [OtherChain.Solana]: {
    bloctoSDK: ExtendedSolaneBloctoSDK;
    address: string | null;
    program: SolanaProgramInfo | null;
  };
};

interface ChainServicesInterface {
  getChainAddress: (chain: ChainsType) => string | null;
  setChainAddress: (chain: ChainsType, address: string) => void;
  getEvmChainContract: (chain: EvmChain) => Contract;
  getSolanaProgramInfo: () => SolanaProgramInfo;
}

type ChainServicesType = FlowInfoType &
  EvmChainsInfoType &
  SolanaInfoType &
  AptosInfoType &
  ChainServicesInterface;

export const ChainServices: ChainServicesType = {
  [Chains.Flow]: { address: null },
  [Chains.Ethereum]: {
    web3: rinkebyWeb3,
    bloctoSDK: rinkebySDK,
    address: null,
    contract: null,
  },
  [Chains.Bsc]: {
    web3: bscWeb3,
    bloctoSDK: bscSDK,
    address: null,
    contract: null,
  },
  [Chains.Polygon]: {
    web3: mumbaiWeb3,
    bloctoSDK: mumbaiSDK,
    address: null,
    contract: null,
  },
  [Chains.Avalanche]: {
    web3: fujiWeb3,
    bloctoSDK: fujiSDK,
    address: null,
    contract: null,
  },
  [Chains.Arbitrum]: {
    web3: arbitrumWeb3,
    bloctoSDK: arbitrumSDK,
    address: null,
    contract: null,
  },
  [Chains.Optimism]: {
    web3: optimismWeb3,
    bloctoSDK: optimismSDK,
    address: null,
    contract: null,
  },
  [Chains.Solana]: { bloctoSDK: solanaSDK, address: null, program: null },
  [Chains.Aptos]: { bloctoSDK: aptosSDK, address: null },

  getChainAddress(chain) {
    return this[chain].address;
  },

  setChainAddress(chain, address) {
    this[chain].address = address;
  },

  getEvmChainContract(chain) {
    if (this[chain].contract === null) {
      this[chain].contract = new this[chain].web3.eth.Contract(
        ContractInfos[chain].abi,
        ContractInfos[chain].address
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this[chain].contract!;
  },

  getSolanaProgramInfo() {
    if (this[Chains.Solana].program === null) {
      const programId = new PublicKey(ContractInfos[Chains.Solana].programId);
      const accountPubKey = new PublicKey(
        ContractInfos[Chains.Solana].accountPubKey
      );
      const programLayout = struct<UInt>([u8("is_init"), u32("value")]);
      this[Chains.Solana].program = {
        programId,
        accountPubKey,
        programLayout,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this[Chains.Solana].program!;
  },
};
