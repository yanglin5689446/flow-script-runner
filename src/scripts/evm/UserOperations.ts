import { ChainServices } from "../../services";
import { EvmChain } from "../../types/ChainTypes";
import ScriptTypes, { ArgTypes } from "../../types/ScriptTypes";

interface IUserOperation {
  callData: string;
  callGasLimit?: number;
  verificationGasLimit?: number;
  preVerificationGas?: number;
  maxFeePerGas?: number;
  maxPriorityFeePerGas?: number;
  paymasterAndData?: number;
  /**
   *  If provided, please ensure it is same as login account.
   */
  sender?: string;
  /**
   * BloctoSDK do not need nonce to send userOperation.  the property below will all be ignored.
   * */
  nonce?: number;
  initCode?: string;
  signature?: string;
}

export const sendTokenWithOperation = {
  type: ScriptTypes.USER_OPERATION,
  script: "",
  description: "Send token with userOperation",
  method: (
    account: string,
    args: IUserOperation,
    chain: EvmChain
  ): Promise<any> => {
    const {
      callData,
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData,
      sender,
      nonce,
      initCode,
      signature,
    } = args;
    // ChainServices[chain].web3.eth.sendTransaction({
    //   from: account,
    //   to: args.receipient,
    //   value: args.amount,
    // }),
    // return ChainServices[chain].bloctoSDK.ethereum.sendUserOperation([
    // return ChainServices[chain].web3.eth.sendTransaction([
    //   {
    //     callData,
    //     callGasLimit,
    //     verificationGasLimit,
    //     preVerificationGas,
    //     maxFeePerGas,
    //     maxPriorityFeePerGas,
    //     paymasterAndData,
    //     sender,
    //     nonce,
    //     initCode,
    //     signature,
    //   },
    // ]);
    return Promise.resolve();
  },
  args: [
    { type: ArgTypes.String, comment: "call data (hex)", name: "callData" },
    { type: ArgTypes.Number, comment: "callGasLimit", name: "callGasLimit" },
    {
      type: ArgTypes.Number,
      comment: "verificationGasLimit",
      name: "verificationGasLimit",
    },
    {
      type: ArgTypes.Number,
      comment: "preVerificationGas",
      name: "preVerificationGas",
    },
    {
      type: ArgTypes.Number,
      comment: "maxFeePerGas",
      name: "maxFeePerGas",
    },
    {
      type: ArgTypes.Number,
      comment: "maxPriorityFeePerGas",
      name: "maxPriorityFeePerGas",
    },
    {
      type: ArgTypes.Number,
      comment: "paymasterAndData",
      name: "paymasterAndData",
    },
    {
      type: ArgTypes.String,
      comment: "sender",
      name: "sender",
    },
    {
      type: ArgTypes.Number,
      comment: "nonce",
      name: "nonce",
    },
    {
      type: ArgTypes.String,
      comment: "initCode",
      name: "initCode",
    },
    {
      type: ArgTypes.String,
      comment: "signature",
      name: "signature",
    },
  ],
  shouldSign: true,
  isArgsAdjustable: false,
};
