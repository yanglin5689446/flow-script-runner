import React, { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import * as SignMessageTemplates from "../scripts/evm/SignMessage";
import * as TransactionsTemplates from "../scripts/evm/Transactions";
import Editor, { FlowArg } from "./Editor";
import EvmChainSelect from "./EvmChainSelect";
import { EvmChain } from "../types/ChainTypes";

const FaucetUrls = {
  [EvmChain.Ethereum]: "https://rinkeby-faucet.com/",
  [EvmChain.Bsc]: "https://testnet.binance.org/faucet-smart",
  [EvmChain.Polygon]: "https://faucet.polygon.technology/",
  [EvmChain.Avalanche]: "https://faucet.avax-test.network/",
};

const MenuGroups = [
  { title: "Transactions", templates: TransactionsTemplates },
  { title: "Sign Message", templates: SignMessageTemplates },
];

const EvmEditor = (): ReactJSXElement => {
  const { chain, address, login } = useContext(Context);
  const toast = useToast();

  const handleSignMessage = useCallback(
    async (args, method) => {
      return new Promise(async (resolve, reject) => {
        try {
          let evmAddress = address;
          if (!evmAddress && login) {
            evmAddress = await login();
          }
          method(args?.[0]?.value ?? "", evmAddress, chain)
            .then(resolve)
            .catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    },
    [address, login, chain]
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
          let evmAddress = address;
          if (!evmAddress && login) {
            evmAddress = await login();
          }

          method(evmAddress, args, chain)
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
    [address, toast, login, chain]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onSignMessage={handleSignMessage}
      onSendTransactions={handleSendTransactions}
      isSandboxDisabled
      shouldClearScript
      isScriptTabDisabled
      faucetUrl={(chain as EvmChain) ? FaucetUrls[chain as EvmChain] : ""}
    >
      <EvmChainSelect />
    </Editor>
  );
};

export default EvmEditor;
