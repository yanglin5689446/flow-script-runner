import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { struct, u8, u32, UInt, Structure } from "@solana/buffer-layout";
import { PublicKey } from "@solana/web3.js";
import { ContractInfos } from "../contracts";
import { Chains, ChainsType, EvmChain, OtherChain } from "../types/ChainTypes";
import { web3, bloctoSDK as evmSDK, ExtendedEvmBloctoSDK } from "./evm";
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

type EvmChainsInfoType = { [EvmChain.Ethereum]: EvmChainInterface };

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
    web3,
    bloctoSDK: evmSDK,
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
