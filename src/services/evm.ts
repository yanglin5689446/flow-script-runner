import { useEffect, useState } from "react";
import Web3 from "web3";
import BloctoSDK, { EthereumProviderInterface } from "@blocto/sdk";

export interface ExtendedEthereumProviderInterface
  extends EthereumProviderInterface {
  enable: () => Promise<any>;
  chainId: string;
}

export interface ExtendedEvmBloctoSDK extends BloctoSDK {
  ethereum: ExtendedEthereumProviderInterface;
}
const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";

export const supportedChains = [
  {
    name: "Ethereum Mainnet",
    chainId: "1",
    rpcUrls: ["https://mainnet.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305"],
  },
  {
    name: "Ethereum Goerli",
    chainId: "5",
    rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
  },
  {
    name: "Arbitrum Mainnet",
    chainId: "0xa4b1",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  },
  {
    name: "Arbitrum Testnet",
    chainId: "0x66eed",
    rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
  },
  {
    name: "BSC",
    chainId: "0x38",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
  },
  {
    name: "BSC Testnet",
    chainId: "0x61",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  },
  {
    name: "Avalanche Mainnet",
    chainId: "0xa86a",
    rpcUrls: ["https://rpc.ankr.com/avalanche"],
  },
  {
    name: "Avalanche Testnet",
    chainId: "0xa869",
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  },
  {
    name: "Polygon Mainnet",
    chainId: "0x89",
    rpcUrls: ["https://polygon-rpc.com"],
  },
  {
    name: "Polygon Testnet",
    chainId: "0x13881",
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  },
  {
    name: "Optimism Mainnet",
    chainId: "0x000a",
    rpcUrls: ["https://mainnet.optimism.io"],
  },
  {
    name: "Optimism Testnet",
    chainId: "0x01A4",
    rpcUrls: ["https://goerli.optimism.io"],
  },
];

const bloctoSDK = new BloctoSDK({
  ethereum: {
    // (required) chainId to be used
    chainId: isMainnet ? "0x1" : "0x5",
    // (required for Ethereum) JSON RPC endpoint
    rpc: isMainnet
      ? "https://mainnet.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305"
      : "https://rpc.ankr.com/eth_goerli",
  },
  appId: process.env.REACT_APP_DAPP_ID,
}) as ExtendedEvmBloctoSDK;

bloctoSDK.ethereum.loadSwitchableNetwork(supportedChains);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const web3 = new Web3(bloctoSDK.ethereum);

export { web3, bloctoSDK };

export const useEthereum = (): {
  account: string | null;
  chainId: string | null;
  ethereum: ExtendedEthereumProviderInterface;
  connect: () => Promise<any>;
  disconnect: () => Promise<any>;
} => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(
    bloctoSDK.ethereum.chainId
  );
  useEffect(() => {
    bloctoSDK.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0]);
    });
    bloctoSDK.ethereum.on("chainChanged", (chainId) => {
      setChainId(chainId);
    });
    bloctoSDK.ethereum.on("disconnect", () => {
      setAccount(null);
    });
  }, []);

  return {
    account,
    chainId,
    ethereum: bloctoSDK.ethereum,
    connect: async () => {
      const accounts = await bloctoSDK.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      return accounts;
    },
    disconnect: () =>
      bloctoSDK.ethereum.request({ method: "wallet_disconnect" }),
  };
};
