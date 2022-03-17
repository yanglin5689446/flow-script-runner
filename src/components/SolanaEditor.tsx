import React, { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import * as TransactionsTemplates from "../scripts/solana/Transactions";
import Editor, { FlowArg } from "./Editor";

const MenuGroups = [
  { title: "Transactions", templates: TransactionsTemplates },
];

const SolanaEditor = (): ReactJSXElement => {
  const { chain, address, login } = useContext(Context);
  const toast = useToast();

  const handleSendTransactions = useCallback(
    async (
      fclArgs: FlowArg[] | undefined,
      shouldSign: boolean | undefined,
      signers: Array<{ privateKey: string; address: string }> | undefined,
      script: string,
      method?: (...param: any[]) => Promise<any>
    ): Promise<{ transactionId: string; transaction: any }> => {
      return new Promise(async (resolve, reject) => {
        const noArgsProvided = fclArgs?.every((arg) => arg.value === undefined);
        if (noArgsProvided) {
          return reject(new Error("Error: Transaction arguments are missing."));
        }

        const args = fclArgs?.reduce(
          (initial: { [key: string]: any }, currentValue: FlowArg) => {
            if (currentValue.name) {
              initial[currentValue.name] = currentValue.value;
            }
            return initial;
          },
          {}
        );

        if (!method) {
          return reject(new Error("Error: Transaction method is missing."));
        }

        try {
          let userAddress = address;
          if (!userAddress && login) {
            userAddress = await login();
          }

          method(userAddress, args, chain)
            .then((transaction) => {
              resolve(transaction);
              toast({
                title: "Transaction is Sealed",
                status: "success",
                isClosable: true,
                duration: 1000,
              });
            })
            .catch((error) => {
              reject(error);
              toast({
                title: "Transaction failed",
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

  return (
    <Editor
      menuGroups={MenuGroups}
      onSendTransactions={handleSendTransactions}
      isSandboxDisabled
      shouldClearScript
      isScriptTabDisabled
    />
  );
};

export default SolanaEditor;
