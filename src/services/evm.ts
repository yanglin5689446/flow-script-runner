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
    chainId: "0x1",
    rpcUrls: ["https://mainnet.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305"],
    environment: "mainnet",
  },
  {
    name: "Ethereum Goerli",
    chainId: "0x5",
    rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
    faucet: "https://goerlifaucet.com/",
    environment: "testnet",
  },
  {
    name: "Arbitrum Mainnet",
    chainId: "0xa4b1",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    environment: "mainnet",
  },
  {
    name: "Arbitrum Testnet",
    chainId: "0x66eed",
    rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
    faucet: "https://faucet.triangleplatform.com/arbitrum/goerli",
    environment: "testnet",
  },
  {
    name: "BSC",
    chainId: "0x38",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    environment: "mainnet",
  },
  {
    name: "BSC Testnet",
    chainId: "0x61",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    faucet: "https://testnet.binance.org/faucet-smart",
    environment: "testnet",
  },
  {
    name: "Avalanche Mainnet",
    chainId: "0xa86a",
    rpcUrls: ["https://rpc.ankr.com/avalanche"],
    environment: "mainnet",
  },
  {
    name: "Avalanche Testnet",
    chainId: "0xa869",
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    faucet: "https://faucet.avax-test.network/",
    environment: "testnet",
  },
  {
    name: "Polygon Mainnet",
    chainId: "0x89",
    rpcUrls: ["https://polygon-rpc.com"],
    environment: "mainnet",
  },
  {
    name: "Polygon Testnet",
    chainId: "0x13881",
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    faucet: "https://faucet.polygon.technology/",
    environment: "testnet",
  },
  {
    name: "Optimism Mainnet",
    chainId: "0x000a",
    rpcUrls: ["https://mainnet.optimism.io"],
    environment: "mainnet",
  },
  {
    name: "Optimism Testnet",
    chainId: "0x01a4",
    rpcUrls: ["https://goerli.optimism.io"],
    faucet: "https://faucet.paradigm.xyz/",
    environment: "testnet",
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
