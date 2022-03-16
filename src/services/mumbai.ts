import Web3 from "web3";
import BloctoSDK from "@blocto/sdk";
import { ExtendedBloctoSDKInterface } from "./rinkeby";

const bloctoSDK = new BloctoSDK({
  ethereum: {
    chainId: "0x13881",
    rpc: "https://rpc-mumbai.maticvigil.com/",
  },
}) as ExtendedBloctoSDKInterface;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const web3 = new Web3(bloctoSDK.ethereum);

export { web3, bloctoSDK };
