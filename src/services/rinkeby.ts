import Web3 from "web3";
import BloctoSDK, { EthereumProviderInterface } from "@blocto/sdk";

export interface ExtendedEthereumProviderInterface
  extends EthereumProviderInterface {
  enable: () => Promise<any>;
}

export interface ExtendedEvmBloctoSDK extends BloctoSDK {
  ethereum: ExtendedEthereumProviderInterface;
}
const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";

const bloctoSDK = new BloctoSDK({
  ethereum: {
    server: "https://wallet-v2.blocto.app",
    // (required) chainId to be used
    chainId: isMainnet ? "0x1" : "0x4",
    // (required for Ethereum) JSON RPC endpoint
    rpc: isMainnet
      ? "https://mainnet.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305"
      : "https://rinkeby.blocto.app/",
  },
  appId: process.env.REACT_APP_DAPP_ID,
}) as ExtendedEvmBloctoSDK;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const web3 = new Web3(bloctoSDK.ethereum);

export { web3, bloctoSDK };
