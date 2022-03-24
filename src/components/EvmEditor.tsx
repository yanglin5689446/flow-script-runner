import React, { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import * as ContractTemplates from "../scripts/evm/Contract";
import * as SignMessageTemplates from "../scripts/evm/SignMessage";
import * as TransactionsTemplates from "../scripts/evm/Transactions";
import Editor, { Arg } from "./Editor";
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
  { title: "Interact With Contract", templates: ContractTemplates },
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

  const checkArguments = useCallback(
    async (args: Arg[] | undefined) => {
      const noArgsProvided = args?.every((arg) => arg.value === undefined);
      if (args?.length !== 0 && noArgsProvided) {
        throw new Error("Error: Transaction arguments are missing.");
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

      try {
        let evmAddress = address;
        if (!evmAddress && login) {
          evmAddress = await login();
        }
        return { address, formattedArgs };
      } catch (error) {
        throw error;
      }
    },
    [address, login]
  );

  const execute = useCallback(
    async (
      args: Arg[] | undefined,
      method?: (...param: any[]) => Promise<any>
    ): Promise<any> => {
      return new Promise(async (resolve, reject) => {
        if (!method) {
          return reject(new Error("Error: Transaction method is missing."));
        }

        try {
          const { address: evmAddress, formattedArgs } = await checkArguments(
            args
          );

          method(evmAddress, formattedArgs, chain).then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    },
    [chain, checkArguments]
  );

  const handleSendTransactions = useCallback(
    (
      args: Arg[] | undefined,
      shouldSign: boolean | undefined,
      signers: Array<{ privateKey: string; address: string }> | undefined,
      script: string,
      method?: (...param: any[]) => Promise<any>
    ): Promise<{ transactionId: string; transaction: any }> => {
      return new Promise(async (resolve, reject) => {
        execute(args, method)
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
      });
    },
    [toast, execute]
  );

  const handleInteractWithContract = useCallback(
    async (
      args: Arg[] | undefined,
      method?: (...param: any[]) => Promise<any>
    ): Promise<string | { transactionId: string; transaction: any }> => {
      return new Promise(async (resolve, reject) => {
        execute(args, method)
          .then((result) => {
            resolve(
              typeof result === "string"
                ? result
                : {
                    transactionId: result.transactionHash,
                    transaction: result,
                  }
            );
            toast({
              title: "Contract Method is Executed",
              status: "success",
              isClosable: true,
              duration: 1000,
            });
          })
          .catch((error) => {
            reject(error);
            toast({
              title: "Contract Method failed",
              status: "error",
              isClosable: true,
              duration: 1000,
            });
          });
      });
    },
    [toast, execute]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onSignMessage={handleSignMessage}
      onSendTransactions={handleSendTransactions}
      onInteractWithContract={handleInteractWithContract}
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
