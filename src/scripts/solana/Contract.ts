import {
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { ChainServices } from "../../services";
import { Chains } from "../../types/ChainTypes";
import ScriptTypes from "../../types/ScriptTypes";
import { base64ToUint8Array } from "../../utils/base64ToUint8Array";

export const getValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  method: (): Promise<any | { is_init: number; number: number }> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Different response type than the type of the response from getAccountInfo in @solana/web3.js
        const accountInfo = await ChainServices[
          Chains.Solana
        ].bloctoSDK?.solana?.request({
          method: "getAccountInfo",
          params: [
            ChainServices.getSolanaProgramInfo().accountPubKey,
            {
              encoding: "base64",
            },
          ],
        });

        if (!accountInfo) {
          reject(new Error("Error: Program not found."));
        }

        const dataInUint8Array = base64ToUint8Array(accountInfo.value.data[0]);
        const info =
          ChainServices.getSolanaProgramInfo().programLayout.decode(
            dataInUint8Array
          );
        resolve(info);
      } catch (error) {
        reject(error);
      }
    });
  },
  args: [],
};

export const setValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  method: (account: string, args: { value: string }): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          value: { blockhash },
        } = await ChainServices[Chains.Solana].bloctoSDK?.solana?.request({
          method: "getRecentBlockhash",
        });

        const allocateStruct = {
          index: 0,
          layout: ChainServices.getSolanaProgramInfo().programLayout,
        };
        const data = Buffer.alloc(allocateStruct.layout.span);
        const layoutFields = {
          instruction: allocateStruct.index,
          value: Number(args.value),
        };
        // eslint-disable-next-line
        // @ts-ignore
        allocateStruct.layout.encode(layoutFields, data);
        const transaction = new Transaction();
        const publicKey = new PublicKey(account);
        transaction.add(
          new TransactionInstruction({
            keys: [
              {
                pubkey: ChainServices.getSolanaProgramInfo().accountPubKey,
                isSigner: false,
                isWritable: true,
              },
              {
                pubkey: publicKey,
                isSigner: false,
                isWritable: false,
              },
            ],
            programId: ChainServices.getSolanaProgramInfo().programId,
            data,
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
  args: [{ type: "String", comment: "value(number)", name: "value" }],
};
