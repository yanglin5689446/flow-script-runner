import { ChainServices } from "../../services";
import { EvmChain } from "../../types/ChainTypes";
import ScriptTypes from "../../types/ScriptTypes";

export const sendETH = {
  type: ScriptTypes.TX,
  script: "",
  method: (
    account: string,
    addr: string,
    amount: string,
    chain: EvmChain
  ): Promise<any> =>
    ChainServices[chain].web3.eth.sendTransaction({
      from: account,
      to: addr,
      value: amount,
    }),
  args: [
    { type: "String", comment: "amount(wei)", name: "amount" },
    { type: "String", comment: "receipient", name: "receipient" },
  ],
  shouldSign: true,
};
