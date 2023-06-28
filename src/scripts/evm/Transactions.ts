import { ChainServices } from "../../services";
import { EvmChain } from "../../types/ChainTypes";
import ScriptTypes, { ArgTypes } from "../../types/ScriptTypes";

export const sendTokens = {
  type: ScriptTypes.TX,
  script: "",
  method: (
    account: string,
    args: { recipient: string; amount: string },
    chain: EvmChain
  ): Promise<any> =>
    ChainServices[chain].web3.eth.sendTransaction({
      from: account,
      to: args.recipient,
      value: args.amount,
    }),
  args: [
    { type: ArgTypes.String, comment: "amount(wei)", name: "amount" },
    { type: ArgTypes.String, comment: "recipient", name: "recipient" },
  ],
  shouldSign: true,
  isArgsAdjustable: false,
};
