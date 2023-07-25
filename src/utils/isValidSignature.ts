import EIP712Util from "eth-eip712-util";
import ERC1271ABI from "../contracts/abi/ERC1271.json";
import { web3 } from "../services/evm";
import DappAuth from "@blocto/dappauth";
import type { EthereumTypes } from "@blocto/sdk";

// bytes4(keccak256("isValidSignature(bytes32,bytes)")
const ERC1271_MAGIC_VALUE = "0x1626ba7e";

export const dappAuth = new DappAuth(web3);

const isValidSignature = async (
  requestObject: EthereumTypes.EIP1193RequestPayload | undefined,
  signature: string,
  address?: string | null
): Promise<boolean> => {
  if (!requestObject || !signature || !address) throw new Error("Invalid args");
  const { method, params } = requestObject;
  try {
    if (method === "personal_sign") {
      const challenge = params?.[0];
      console.log("personal_sign", challenge, signature, address, dappAuth);
      const isAuthorizedSigner = await dappAuth.isAuthorizedSigner(
        challenge,
        signature,
        address
      );
      return isAuthorizedSigner;
    }

    const challenge = params?.[1];
    let formattedChallenge;
    if (method == "eth_signTypedData") {
      formattedChallenge =
        "0x" +
        EIP712Util.hashForSignTypedDataLegacy({
          data: JSON.parse(challenge),
        }).toString("hex");
    }
    if (method == "eth_signTypedData_v3") {
      formattedChallenge =
        "0x" +
        EIP712Util.hashForSignTypedData_v3({
          data: JSON.parse(challenge),
        }).toString("hex");
    }
    if (method == "eth_signTypedData_v4") {
      formattedChallenge =
        "0x" +
        EIP712Util.hashForSignTypedData_v4({
          data: JSON.parse(challenge),
        }).toString("hex");
    }

    const erc1271Contract = new web3.eth.Contract(ERC1271ABI as any, address);
    const magicValue = await erc1271Contract.methods
      .isValidSignature(formattedChallenge, signature)
      .call({ from: address });

    const isAuthorizedSigner = magicValue === ERC1271_MAGIC_VALUE;

    return isAuthorizedSigner;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default isValidSignature;
