import React, { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import * as ContractTemplates from "../scripts/evm/Contract";
import * as SignMessageTemplates from "../scripts/evm/SignMessage";
import * as TransactionsTemplates from "../scripts/evm/Transactions";
import { EvmChain } from "../types/ChainTypes";
import ScriptTypes, { Arg, ArgTypes, PerInfo } from "../types/ScriptTypes";
import Editor from "./Editor";
import EvmChainSelect from "./EvmChainSelect";

const typeKeys = Object.values(ArgTypes);

const FaucetUrls = {
  [EvmChain.Ethereum]: "https://rinkeby-faucet.com/",
  [EvmChain.Bsc]: "https://testnet.binance.org/faucet-smart",
  [EvmChain.Polygon]: "https://faucet.polygon.technology/",
  [EvmChain.Avalanche]: "https://faucet.avax-test.network/",
  [EvmChain.Arbitrum]: "https://faucet.triangleplatform.com/arbitrum/goerli",
  [EvmChain.Optimism]: "https://faucet.paradigm.xyz/",
};

const MenuGroups = [
  { title: "Transactions", templates: TransactionsTemplates },
  { title: "Sign Message", templates: SignMessageTemplates },
  { title: "Contract", templates: ContractTemplates },
];

const formatTransactionArgs = (args: Arg[] | undefined) => {
  return args?.reduce((initial: { [key: string]: any }, currentValue: Arg) => {
    if (currentValue.name) {
      initial[currentValue.name] =
        currentValue.type === ArgTypes.Number
          ? +currentValue.value
          : currentValue.value;
    }
    return initial;
  }, {});
};

const formatContractArgs = (args: Arg[] | undefined) => {
  return args
    ?.map((arg) => {
      return arg.type === ArgTypes.Number ? +arg.value : arg.value;
    })
    .filter((arg): arg is string | number => arg);
};

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

  const checkArgumentsAndAddress = useCallback(
    async (args: Arg[] | undefined) => {
      return new Promise(async (resolve, reject) => {
        const noArgsProvided = args?.every((arg) => arg.value === undefined);
        if (args?.length !== 0 && noArgsProvided) {
          throw new Error("Error: Transaction arguments are missing.");
        }

        try {
          let evmAddress = address;
          if (!evmAddress && login) {
            evmAddress = await login();
          }

          resolve(evmAddress);
        } catch (error) {
          reject(error);
        }
      });
    },
    [address, login]
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
        if (!method) {
          return reject(new Error("Error: Transaction method is missing."));
        }

        const address = await checkArgumentsAndAddress(args);
        const formattedArgs = formatTransactionArgs(args);

        method(address, formattedArgs, chain)
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
    [toast, checkArgumentsAndAddress, chain]
  );

  const handleInteractWithContract = useCallback(
    async (
      contractInfo: Record<string, PerInfo>,
      args: Arg[] | undefined,
      method?: (...param: any[]) => Promise<any>
    ): Promise<string | { transactionId: string; transaction: any }> => {
      return new Promise(async (resolve, reject) => {
        if (!method) {
          return reject(new Error("Error: Transaction method is missing."));
        }

        const address = await checkArgumentsAndAddress(args);
        const formattedArgs = formatContractArgs(args);

        method({
          account: address,
          args: formattedArgs,
          chain,
          contractAbi: contractInfo?.contractAbi?.value,
          contractAddress: contractInfo?.contractAddress?.value,
          methodName: contractInfo?.methodName?.value,
        })
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
    [toast, checkArgumentsAndAddress, chain]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onSignMessage={handleSignMessage}
      onSendTransactions={handleSendTransactions}
      argTypes={typeKeys}
      onInteractWithContract={handleInteractWithContract}
      isSandboxDisabled
      shouldClearScript
      disabledTabs={[ScriptTypes.SCRIPT, ScriptTypes.RESOURCE]}
      tabsShouldLoadDefaultTemplate={[ScriptTypes.SIGN, ScriptTypes.CONTRACT]}
      faucetUrl={(chain as EvmChain) ? FaucetUrls[chain as EvmChain] : ""}
    >
      <EvmChainSelect />
    </Editor>
  );
};

export default EvmEditor;
