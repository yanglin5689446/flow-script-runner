import Web3 from "web3";
import BloctoSDK from "@blocto/sdk";
import { ExtendedEvmBloctoSDK } from "./rinkeby";

const bloctoSDK = new BloctoSDK({
  ethereum: {
    chainId: "0x61", // 97: BSC Testnet,
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
}) as ExtendedEvmBloctoSDK;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const web3 = new Web3(bloctoSDK.ethereum);

export { web3, bloctoSDK };
