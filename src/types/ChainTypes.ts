export enum OtherChain {
  Flow = "flow",
  Solana = "solana",
  Aptos = "aptos",
}

export enum EvmChain {
  Ethereum = "ethereum",
  Bsc = "bsc",
  Polygon = "polygon",
  Avalanche = "avalance",
  Arbitrum = "arbitrum",
  Optimism = "optimism",
}

export enum EvmTestChain {
  Ethereum = "0x5",
  Bsc = "0x61",
  Polygon = "0x13881",
  Avalanche = "0xa869",
  Arbitrum = "0x66eed",
  Optimism = "0x01a4",
}

export type ChainsType = OtherChain | EvmChain;

export const Chains = { ...OtherChain, ...EvmChain };
