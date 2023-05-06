import Web3 from "web3";
import BloctoSDK from "@blocto/sdk";
import { ExtendedEvmBloctoSDK } from "./goerli";

const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";

const bloctoSDK = new BloctoSDK({
  ethereum: {
    chainId: isMainnet ? "0xa4b1" : "0x66eed",
    rpc: isMainnet
      ? "https://arb1.arbitrum.io/rpc"
      : "https://goerli-rollup.arbitrum.io/rpc",
  },
  appId: process.env.REACT_APP_DAPP_ID,
}) as ExtendedEvmBloctoSDK;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const web3 = new Web3(bloctoSDK.ethereum);

export { web3, bloctoSDK };
