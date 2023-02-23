import * as fcl from "@blocto/fcl";

interface Data {
  address: string;
  nonce: string;
  signatures: Array<Record<string, any>>;
}

export const verifyAccountProofSignature = (
  appIdentifier: string,
  accountProofData: Data
): Promise<boolean> => {
  const { address, nonce, signatures } = accountProofData;
  return fcl.AppUtils.verifyAccountProof(appIdentifier, {
    address,
    nonce,
    signatures,
  });
};
