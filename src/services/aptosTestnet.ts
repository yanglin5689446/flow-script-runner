import BloctoSDK, { AptosProviderInterface } from "@blocto/sdk";

export interface ExtendedAptosProviderInterface extends AptosProviderInterface {
  request: (params: { method: string; params?: any }) => Promise<any>;
}

export interface ExtendedAptosBloctoSDK extends BloctoSDK {
  aptos: ExtendedAptosProviderInterface;
}

const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";

const bloctoSDK = new BloctoSDK({
  aptos: {
    chainId: isMainnet ? 1 : 2,
  },
  appId: process.env.REACT_APP_DAPP_ID,
}) as ExtendedAptosBloctoSDK;

export { bloctoSDK };
