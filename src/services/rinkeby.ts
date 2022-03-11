import Web3 from "web3";
import BloctoSDK, { EthereumProviderInterface } from "@blocto/sdk";

interface ExtendedEthereumProviderInterface extends EthereumProviderInterface {
  enable: () => Promise<any>;
}

interface ExtendedBloctoSDKInterface extends BloctoSDK {
  ethereum: ExtendedEthereumProviderInterface;
}

//{ ethereum: ExtendedEthereumProviderInterface }
const bloctoSDK = new BloctoSDK({
  ethereum: {
    // (required) chainId to be used
    chainId: "0x4",
    // (required for Ethereum) JSON RPC endpoint
    rpc: "https://rinkeby.infura.io/v3/ef5a5728e2354955b562d2ffa4ae5305",
  },
}) as ExtendedBloctoSDKInterface;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const web3 = new Web3(bloctoSDK.ethereum);

export { web3, bloctoSDK };
