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
  paymasterAndData?: string;
  /**
   *  If provided, please ensure it is same as login account.
   */
  sender?: string;
}

interface Args {
  type: ArgTypes;
  comment: string;
  name: string;
  value?: string;
}
const userOperationRestArgs: Args[] = [
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
    type: ArgTypes.String,
    comment: "paymasterAndData",
    name: "paymasterAndData",
  },
  {
    type: ArgTypes.String,
    comment: "sender",
    name: "sender",
  },
];

function getModifiedArgs(args: Args[], name: string, newValue: string): Args[] {
  return args.map((item) => {
    if (item.name === name) {
      return { ...item, value: newValue };
    } else {
      return item;
    }
  });
}

export const sendTokens = {
  type: ScriptTypes.USER_OPERATION,
  description: "Send native token",
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
    } = args;
    return ChainServices[chain].bloctoSDK.ethereum.sendUserOperation({
      callData,
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData,
      sender,
    });
  },
  args: [
    {
      type: ArgTypes.String,
      comment: "call data (hex)",
      name: "callData",
      value:
        "b61d27f600000000000000000000000050504ab483c9bde3af9700b5fe77a860d81b3e4f00000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
    },
    ...userOperationRestArgs,
  ],
};

export const transferErc20 = {
  type: ScriptTypes.USER_OPERATION,
  description: "Transfer erc20 token",
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
    } = args;
    return ChainServices[chain].bloctoSDK.ethereum.sendUserOperation({
      callData,
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData,
      sender,
    });
  },
  args: [
    {
      type: ArgTypes.String,
      comment: "call data (hex)",
      name: "callData",
      value:
        "b61d27f60000000000000000000000002d7882bedcbfddce29ba99965dd3cdf7fcb10a1e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044a9059cbb00000000000000000000000050504ab483c9bde3af9700b5fe77a860d81b3e4f000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
    },
    ...userOperationRestArgs,
  ],
};

export const setValue = {
  type: ScriptTypes.USER_OPERATION,
  description: "Call setValue function on contract",
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
    } = args;
    return ChainServices[chain].bloctoSDK.ethereum.sendUserOperation({
      callData,
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData,
      sender,
    });
  },
  args: [
    {
      type: ArgTypes.String,
      comment: "call data (hex)",
      name: "callData",
      value:
        "b61d27f6000000000000000000000000dc5fd9220511a7211719dd8206ec2d686054bcc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002455241077000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
    },
    ...userOperationRestArgs,
  ],
  shouldSign: true,
};

export const setValueWithCustomPaymaster = {
  type: ScriptTypes.USER_OPERATION,
  description: "Call setValue function on contract with custom paymaster",
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
    } = args;

    return ChainServices[chain].bloctoSDK.ethereum.sendUserOperation({
      callData,
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData,
      sender,
    });
  },
  args: [
    {
      type: ArgTypes.String,
      comment: "call data (hex)",
      name: "callData",
      value:
        "b61d27f6000000000000000000000000dc5fd9220511a7211719dd8206ec2d686054bcc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002455241077000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
    },
    ...getModifiedArgs(
      userOperationRestArgs,
      "paymasterAndData",
      "411bafa5a252F47e27B399Ab48e0A7aDcB4256A10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006492d7d9dbaab7fcd442c32259de3c1a450c3a79d134fc813702dd9689d0415261e0c9004a39173aa923a93df22b1067414927405f4c92ab2692e858570605804ca89d4c1c"
    ),
  ],
  shouldSign: true,
};
