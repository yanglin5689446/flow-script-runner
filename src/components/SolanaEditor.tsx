import React, { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import * as ContractTemplates from "../scripts/solana/Contract";
import * as TransactionsTemplates from "../scripts/solana/Transactions";
import Editor, { Arg } from "./Editor";
import ScriptTypes from "../types/ScriptTypes";

const MenuGroups = [
  { title: "Transactions", templates: TransactionsTemplates },
  { title: "Contract", templates: ContractTemplates },
];

const SolanaEditor = (): ReactJSXElement => {
  const { chain, address, login } = useContext(Context);
  const toast = useToast();

  const execute = useCallback(
    async (
      type: ScriptTypes.TX | ScriptTypes.CONTRACT,
      args: Arg[] | undefined,
      method?: (...param: any[]) => Promise<any>
    ): Promise<{ transactionId: string; transaction: any }> => {
      return new Promise(async (resolve, reject) => {
        const noArgValuesProvided = args?.every(
          (arg) => arg.value === undefined
        );
        if (args?.length !== 0 && noArgValuesProvided) {
          return reject(
            new Error(
              `Error: ${
                type === ScriptTypes.TX ? "Transaction" : "Contract method"
              } arguments are missing.`
            )
          );
        }

        const formattedArgs = args?.reduce(
          (initial: { [key: string]: any }, currentValue: Arg) => {
            if (currentValue.name) {
              initial[currentValue.name] = currentValue.value;
            }
            return initial;
          },
          {}
        );

        if (!method) {
          return reject(
            new Error(
              `Error: ${
                type === ScriptTypes.TX ? "Transaction" : "Contract"
              } method is not provided.`
            )
          );
        }

        try {
          let userAddress = address;
          if (!userAddress && login) {
            userAddress = await login();
          }

          method(userAddress, formattedArgs, chain)
            .then((transaction) => {
              resolve(transaction);
              toast({
                title:
                  type === ScriptTypes.TX
                    ? "Transaction is sealed"
                    : "Contract method is executed",
                status: "success",
                isClosable: true,
                duration: 1000,
              });
            })
            .catch((error) => {
              reject(error);
              toast({
                title: `${
                  type === ScriptTypes.TX ? "Transaction" : "Contract method"
                } failed`,
                status: "error",
                isClosable: true,
                duration: 1000,
              });
            });
        } catch (error) {
          reject(error);
        }
      });
    },
    [address, toast, login, chain]
  );

  const handleSendTransactions = useCallback(
    async (
      args: Arg[] | undefined,
      shouldSign: boolean | undefined,
      signers: Array<{ privateKey: string; address: string }> | undefined,
      script: string,
      method?: (...param: any[]) => Promise<any>
    ): Promise<{ transactionId: string; transaction: any }> => {
      return execute(ScriptTypes.TX, args, method);
    },
    [execute]
  );

  const handleInteractWithContract = useCallback(
    async (
      args: Arg[] | undefined,
      method?: (...param: any[]) => Promise<any>
    ): Promise<{ transactionId: string; transaction: any }> => {
      return execute(ScriptTypes.CONTRACT, args, method);
    },
    [execute]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onSendTransactions={handleSendTransactions}
      onInteractWithContract={handleInteractWithContract}
      isSandboxDisabled
      shouldClearScript
      isScriptTabDisabled
      faucetUrl="https://solfaucet.com/"
    />
  );
};

export default SolanaEditor;
