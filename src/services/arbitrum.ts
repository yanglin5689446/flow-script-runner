import Web3 from "web3";
import BloctoSDK from "@blocto/sdk";
import { ExtendedEvmBloctoSDK } from "./rinkeby";

const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";

const bloctoSDK = new BloctoSDK({
  ethereum: {
    server: "http://localhost:3000",
    chainId: isMainnet ? "0xa4b1" : "0x66eed",
    rpc: isMainnet
      ? "https://endpoints.omniatech.io/v1/arbitrum/one/public"
      : "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
  },
  appId: process.env.REACT_APP_DAPP_ID,
}) as ExtendedEvmBloctoSDK;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const web3 = new Web3(bloctoSDK.ethereum);

export { web3, bloctoSDK };
