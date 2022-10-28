import {
  Transaction,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { Buffer } from "buffer";
import { ContractInfos } from "../../contracts";
import { ChainServices } from "../../services";
import { Chains, ChainsType, OtherChain } from "../../types/ChainTypes";
import ScriptTypes, { ArgTypes, PerInfo } from "../../types/ScriptTypes";

const formatProgramStruct = (data: Array<{ name: string; type: string }>) => {
  const withBufferLayout = data.map((attribute) =>
    // eslint-disable-next-line
    // @ts-ignore
    BufferLayout?.[attribute.type]?.(attribute.name)
  );
  return BufferLayout.struct(withBufferLayout);
};

export const getValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Read from the contract",
  method: (
    account: string,
    args: Record<string, any>,
    contractInfo: {
      programId: string;
      accountPubKey: string;
      struct: string;
      methodIndex?: number;
    }
  ): Promise<any | { is_init: number; number: number }> => {
    return new Promise(async (resolve, reject) => {
      const { accountPubKey, struct } = contractInfo;
      try {
        const key =
          new PublicKey(accountPubKey) ??
          ChainServices.getSolanaProgramInfo().accountPubKey;
        // Different response type than the type of the response from getAccountInfo in @solana/web3.js
        const accountInfo = await ChainServices[
          Chains.Solana
        ].bloctoSDK?.solana?.request({
          method: "getAccountInfo",
          params: [
            key,
            {
              encoding: "base64",
            },
          ],
        });

        if (!accountInfo) {
          reject(new Error("Error: Program not found."));
        }

        const layout = struct
          ? formatProgramStruct(JSON.parse(struct))
          : ChainServices.getSolanaProgramInfo().programLayout;
        const info = layout.decode(accountInfo?.data);
        resolve(info);
      } catch (error) {
        reject(error);
      }
    });
  },
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
    programId: {
      comment: "program id",
      value: ContractInfos[chain as OtherChain.Solana].programId,
    },
    accountPubKey: {
      comment: "account PubKey",
      value: ContractInfos[chain as OtherChain.Solana].accountPubKey,
    },
    struct: {
      comment: "program layout",
      value: JSON.stringify([
        { name: "is_init", type: "u8" },
        { name: "value", type: "u32" },
      ]),
    },
  }),
  args: [],
};

export const setValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Write with the contract method",
  method: (
    account: string,
    args: Record<string, any>,
    contractInfo: {
      programId: string;
      accountPubKey: string;
      struct: string;
      methodIndex?: number;
    }
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          programId: contractProgramInfo,
          accountPubKey,
          struct,
          methodIndex,
        } = contractInfo;
        const {
          value: { blockhash },
        } = await ChainServices[Chains.Solana].bloctoSDK?.solana?.request({
          method: "getRecentBlockhash",
        });

        const layout = struct
          ? formatProgramStruct(JSON.parse(struct))
          : ChainServices.getSolanaProgramInfo().programLayout;
        const allocateStruct = {
          index: methodIndex ?? 0,
          layout,
        };
        const data = Buffer.alloc(allocateStruct.layout.span);
        const layoutFields = {
          instruction: allocateStruct.index,
          ...args,
        };
        // eslint-disable-next-line
        // @ts-ignore
        allocateStruct.layout.encode(layoutFields, data);

        const transaction = new Transaction();
        const publicKey = new PublicKey(account);
        const pubkey =
          new PublicKey(accountPubKey) ??
          ChainServices.getSolanaProgramInfo().accountPubKey;
        const programId =
          new PublicKey(contractProgramInfo) ??
          ChainServices.getSolanaProgramInfo().programId;

        transaction.add(
          new TransactionInstruction({
            keys: [
              {
                pubkey,
                isSigner: false,
                isWritable: true,
              },
              {
                pubkey: publicKey,
                isSigner: false,
                isWritable: false,
              },
            ],
            programId,
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
  contractInfo: (chain: ChainsType): Record<string, PerInfo> => ({
    programId: {
      comment: "program id",
      value: ContractInfos[chain as OtherChain.Solana].programId,
    },
    accountPubKey: {
      comment: "account PubKey",
      value: ContractInfos[chain as OtherChain.Solana].accountPubKey,
    },
    struct: {
      comment: "program layout",
      value: JSON.stringify([
        { name: "is_init", type: "u8" },
        { name: "value", type: "u32" },
      ]),
    },
    methodIndex: { comment: "method index", value: "0" },
  }),
  args: [{ type: ArgTypes.Number, comment: "value(number)", name: "value" }],
};
