import * as fcl from "@blocto/fcl";

interface Params {
  address: string;
  timestamp: number;
  appDomainTag?: string;
  signatures: Array<{
    f_type: "CompositeSignature";
    f_vsn: string;
    addr: string;
    signature: string;
    keyId: number;
  }>;
}

export const verifyAccountProofSignature = ({
  address,
  timestamp,
  appDomainTag,
  signatures,
}: Params): Promise<boolean> => {
  const provableMessage =
    fcl.WalletUtils.encodeMessageForProvableAuthnVerifying(
      address,
      timestamp,
      appDomainTag
    );
  return fcl.verifyUserSignatures(provableMessage, signatures);
};
