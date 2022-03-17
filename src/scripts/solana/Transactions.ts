import {
  Keypair,
  Transaction,
  PublicKey,
  SystemProgram,
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

export const createAccountAndTransfer = {
  type: ScriptTypes.TX,
  script: "",
  description:
    "Create a new account and transfer 100 lamports to it.\nThis is a kind of transaction involving dApp side signing.",
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

        const rent = await ChainServices[
          Chains.Solana
        ].bloctoSDK?.solana?.request({
          method: "getMinimumBalanceForRentExemption",
          params: [10],
        });

        const createAccountInstruction = SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: newAccountKey,
          lamports: rent,
          // create an account with newly-generated key, and assign it to system program
          programId: SystemProgram.programId,
          space: 10,
        });
        transaction.add(createAccountInstruction);

        const createdPublicKey = newAccountKey.toBase58();

        const transferInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: newAccountKey,
          lamports: 100,
        });
        transaction.add(transferInstruction);

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

export const createAccount = {
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

        const rent = await ChainServices[
          Chains.Solana
        ].bloctoSDK?.solana?.request({
          method: "getMinimumBalanceForRentExemption",
          params: [10],
        });

        const createAccountInstruction = SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: newAccountKey,
          lamports: rent,
          // create an account with newly-generated key, and assign it to system program
          programId: SystemProgram.programId,
          space: 10,
        });
        transaction.add(createAccountInstruction);

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
