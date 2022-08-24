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
}

export type ChainsType = OtherChain | EvmChain;

export const Chains = { ...OtherChain, ...EvmChain };
