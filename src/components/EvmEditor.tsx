import React, { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { UserContext } from "../context/EvmUserConext";
import * as SignMessageTemplates from "../scripts/evm/SignMessage";
import * as TransactionsTemplates from "../scripts/evm/Transactions";
import Editor, { FlowArg } from "./Editor";
import EvmChainSelect from "./EvmChainSelect";

const MenuGroups = [
  { title: "Transactions", templates: TransactionsTemplates },
  { title: "Sign Message", templates: SignMessageTemplates },
];

const EvmEditor = (): ReactJSXElement => {
  const { chain, ethAddress, login } = useContext(UserContext);
  const toast = useToast();

  const handleSignMessage = useCallback(
    async (args, method) => {
      return new Promise(async (resolve, reject) => {
        try {
          let address = ethAddress;
          if (!address && login) {
            address = await login();
          }
          method(args?.[0]?.value ?? "", address, chain)
            .then(resolve)
            .catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    },
    [ethAddress, login, chain]
  );

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
          let address = ethAddress;
          if (!address && login) {
            address = await login();
          }

          method(address, args, chain)
            .then((transaction) => {
              resolve({
                transactionId: transaction.transactionHash,
                transaction,
              });
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
    [ethAddress, toast, login, chain]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onSignMessage={handleSignMessage}
      onSendTransactions={handleSendTransactions}
      isSandboxDisabled
      shouldClearScript
      isScriptTabDisabled
    >
      <EvmChainSelect />
    </Editor>
  );
};

export default EvmEditor;
