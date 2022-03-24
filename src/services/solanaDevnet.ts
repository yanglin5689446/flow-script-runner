import BloctoSDK, { SolanaProviderInterface } from "@blocto/sdk";

export interface ExtendedSolanaProviderInterface
  extends SolanaProviderInterface {
  request: (params: { method: string; params?: any }) => Promise<any>;
}

export interface ExtendedSolaneBloctoSDK extends BloctoSDK {
  solana: ExtendedSolanaProviderInterface;
}

const bloctoSDK = new BloctoSDK({
  solana: {
    net: "devnet",
  },
}) as ExtendedSolaneBloctoSDK;

export { bloctoSDK };
