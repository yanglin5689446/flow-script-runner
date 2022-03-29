import {
  Keypair,
  Transaction,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
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

export const testPartialSign = {
  type: ScriptTypes.TX,
  script: "",
  description: "Test Partial Sign",
  method: async (account: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          value: { blockhash },
        } = await ChainServices[Chains.Solana].bloctoSDK?.solana?.request({
          method: "getRecentBlockhash",
        });
        const transaction = new Transaction();
        const publicKey = new PublicKey(account);

        const newKeypair = new Keypair();
        const newAccountKey = newKeypair.publicKey;

        const memoInstruction = new TransactionInstruction({
          keys: [
            { pubkey: publicKey, isSigner: false, isWritable: true },
            { pubkey: newAccountKey, isSigner: true, isWritable: true },
          ],
          data: Buffer.from("Data to send in transaction", "utf-8"),
          programId: new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
        });
        transaction.add(memoInstruction);

        const createdPublicKey = newAccountKey.toBase58();

        transaction.feePayer = publicKey;
        transaction.recentBlockhash = blockhash;

        const converted = await ChainServices[
          Chains.Solana
        ].bloctoSDK?.solana?.convertToProgramWalletTransaction(transaction);

        if (converted) {
          converted?.partialSign(newKeypair);
          const transactionId = await ChainServices[
            Chains.Solana
          ].bloctoSDK?.solana?.signAndSendTransaction(converted);
          resolve({
            transactionId,
            transaction: `Created account successfully with PubKey as ${createdPublicKey}.`,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  args: [],
};

export const testPartialSignAndWrap = {
  type: ScriptTypes.TX,
  script: "",
  method: async (account: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          value: { blockhash },
        } = await ChainServices[Chains.Solana].bloctoSDK?.solana?.request({
          method: "getRecentBlockhash",
        });
        const transaction = new Transaction();
        const publicKey = new PublicKey(account);

        const newKeypair = new Keypair();
        const newAccountKey = newKeypair.publicKey;

        const memoInstruction = new TransactionInstruction({
          keys: [
            { pubkey: publicKey, isSigner: false, isWritable: true },
            { pubkey: newAccountKey, isSigner: true, isWritable: true },
          ],
          data: Buffer.from("Data to send in transaction", "utf-8"),
          programId: new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
        });
        // at least 2 instructions to make them wrapped by backend
        transaction.add(memoInstruction);
        transaction.add(memoInstruction);

        const createdPublicKey = newAccountKey.toBase58();

        transaction.feePayer = publicKey;
        transaction.recentBlockhash = blockhash;

        const converted = await ChainServices[
          Chains.Solana
        ].bloctoSDK?.solana?.convertToProgramWalletTransaction(transaction);

        if (converted) {
          converted?.partialSign(newKeypair);
          const transactionId = await ChainServices[
            Chains.Solana
          ].bloctoSDK?.solana?.signAndSendTransaction(converted);
          resolve({
            transactionId,
            transaction: `Created account successfully with PubKey as ${createdPublicKey}.`,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  args: [],
};
