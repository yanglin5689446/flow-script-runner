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

export enum EvmChainId {
  Ethereum = "0x1",
  EthereumGoerli = "0x5",
  Bsc = "0x38",
  BscTestnet = "0x61",
  Polygon = "0x89",
  PolygonTestnet = "0x13881",
  Avalanche = "0xa86a",
  AvalancheTestnet = "0xa869",
  Arbitrum = "0xa4b1",
  ArbitrumTestnet = "0x66eed",
  Optimism = "0x000a",
  OptimismTestnet = "0x01a4",
}

export type ChainsType = OtherChain | EvmChain;

export const Chains = { ...OtherChain, ...EvmChain };
