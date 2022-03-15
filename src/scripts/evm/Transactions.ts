import ScriptTypes from "../../types/ScriptTypes";
import { web3 } from "../../services/rinkeby";

export const sendETH = {
  type: ScriptTypes.TX,
  script: "",
  method: (account: string, addr: string, amount: string): Promise<any> =>
    web3.eth.sendTransaction({
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
