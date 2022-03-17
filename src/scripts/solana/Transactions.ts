import { Transaction, PublicKey, SystemProgram } from "@solana/web3.js";
import { ChainServices } from "../../services";
import { Chains } from "../../types/ChainTypes";
import ScriptTypes from "../../types/ScriptTypes";

export const sendSOL = {
  type: ScriptTypes.TX,
  script: "",
  method: async (
    account: string,
    args: { receipient: string; amount: string }
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          value: { blockhash },
        } = await ChainServices[Chains.Solana].bloctoSDK?.solana?.request({
          method: "getRecentBlockhash",
        });
        const transaction = new Transaction();
        const publicKey = new PublicKey(account);
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(args.receipient),
            lamports: Number(args.amount),
          })
        );
        transaction.feePayer = publicKey;
        transaction.recentBlockhash = blockhash;

        const transactionId = await ChainServices[
          Chains.Solana
        ].bloctoSDK?.solana?.signAndSendTransaction(transaction);

        resolve({
          transactionId,
          transaction: transactionId,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  args: [
    { type: "String", comment: "amount(lamports)", name: "amount" },
    { type: "String", comment: "receipient", name: "receipient" },
  ],
};
