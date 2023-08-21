import { AbiItem } from "web3-utils";
import { OtherChain, EvmChainId } from "../types/ChainTypes";
import valueDappAbi from "./valueDappAbi";

type ContractInfosType = {
  [OtherChain.Aptos]: { address: string };
} & {
  [key in EvmChainId]: { abi: AbiItem[] | AbiItem; address: string };
};

export const ContractInfos: ContractInfosType = {
  [EvmChainId.Ethereum]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [EvmChainId.EthereumGoerli]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [EvmChainId.Bsc]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [EvmChainId.BscTestnet]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [EvmChainId.Polygon]: {
    abi: valueDappAbi,
    address: "0xD76bAA840e3D5AE1C5E5C7cEeF1C1A238687860e",
  },
  [EvmChainId.PolygonTestnet]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [EvmChainId.Avalanche]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [EvmChainId.AvalancheTestnet]: {
    abi: valueDappAbi,
    address: "0xD76bAA840e3D5AE1C5E5C7cEeF1C1A238687860e",
  },
  [EvmChainId.Arbitrum]: {
    abi: valueDappAbi,
    address: "0x806243c7368a90D957592B55875eF4C3353C5bEa",
  },
  [EvmChainId.ArbitrumTestnet]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [EvmChainId.Optimism]: {
    abi: valueDappAbi,
    address: "0x806243c7368a90D957592B55875eF4C3353C5bEa",
  },
  [EvmChainId.OptimismTestnet]: {
    abi: valueDappAbi,
    address: "0x009c403BdFaE357d82AAef2262a163287c30B739",
  },
  [OtherChain.Aptos]: {
    address:
      "0x4282ed29feb89781cd4da44a5bb1d23ff7e31a9dd64536233792efe78b4a494d",
  },
};
