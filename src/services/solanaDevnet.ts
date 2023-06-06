import BloctoSDK, { SolanaProviderInterface } from "@blocto/sdk";

export interface ExtendedSolanaProviderInterface
  extends SolanaProviderInterface {
  request: (params: { method: string; params?: any }) => Promise<any>;
}

export interface ExtendedSolaneBloctoSDK extends BloctoSDK {
  solana: ExtendedSolanaProviderInterface;
}

const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";

const bloctoSDK = new BloctoSDK({
  solana: {
    net: isMainnet ? "mainnet-beta" : "devnet",
    rpc: isMainnet ? "https://api.metaplex.solana.com/" : undefined,
  },
  appId: process.env.REACT_APP_DAPP_ID,
}) as ExtendedSolaneBloctoSDK;

export { bloctoSDK };
