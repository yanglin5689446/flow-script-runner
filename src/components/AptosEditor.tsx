import React, { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import * as AptosModulesTemplate from "../scripts/aptos/Modules";
import * as AptosResourceTemplate from "../scripts/aptos/Resource";
import * as ScriptTemplates from "../scripts/aptos/Script";
import * as SignMessageTemplates from "../scripts/aptos/SignMessage";
import { ChainServices } from "../services";
import { Chains } from "../types/ChainTypes";
import ScriptTypes, {
  Arg,
  AptosArgTypes,
  AptosScriptAbiKeys,
  PerInfo,
  PerScriptAbi,
} from "../types/ScriptTypes";
import type { AptosTypes } from "@blocto/sdk";
import Editor from "./Editor";

const typeKeys = Object.values(AptosArgTypes);

const MenuGroups = [
  { title: "Script", templates: ScriptTemplates },
  { title: "Contract", templates: AptosModulesTemplate },
  { title: "Sign Message", templates: SignMessageTemplates },
  { title: "Resource", templates: AptosResourceTemplate },
];

const formatTransactionArgs = (args: Arg[] | undefined) => {
  return args?.reduce((initial: { [key: string]: any }, currentValue: Arg) => {
    if (currentValue.name) {
      initial[currentValue.name] =
        currentValue.type === AptosArgTypes.Number
          ? +currentValue.value
          : currentValue.type === AptosArgTypes.Bool && currentValue.value
          ? JSON.parse(currentValue.value.toLowerCase())
          : currentValue.value;
    }
    return initial;
  }, {}) as AptosTypes.SignMessagePayload;
};

const AptosEditor = (): ReactJSXElement => {
  const toast = useToast();

  const handleGetResource = useCallback((args, method) => {
    return new Promise(async (resolve, reject) => {
      try {
        const address = args?.[0]?.value ?? "";
        const type = args?.[1]?.value ?? "";
        method(address, type).then(resolve).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const handleSignMessage = useCallback((args) => {
    return new Promise<AptosTypes.SignMessageResponse>((resolve) => {
      const aptos = ChainServices[Chains.Aptos]?.bloctoSDK?.aptos;
      resolve(aptos.signMessage(formatTransactionArgs(args)));
    });
  }, []);

  const handleInteractWithContract = useCallback(
    async (
      contractInfo: Record<string, PerInfo>,
      args?: Arg[],
      method?: (...param: any[]) => Promise<any>
    ) => {
      return new Promise<string>((resolve, reject) => {
        method?.(contractInfo, args)
          .then((hash) => resolve(hash))
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
    [toast]
  );

  const handleSendScript = useCallback(
    async (
      script: string,
      args?: Arg[],
      method?: (...param: any[]) => Promise<any>,
      scriptInfo?: Record<string, PerInfo>,
      scriptAbi?: Record<AptosScriptAbiKeys, PerScriptAbi>
    ) => {
      return new Promise<string>((resolve, reject) => {
        method?.(scriptInfo, args, scriptAbi)
          .then((hash) => resolve(hash))
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
    [toast]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onGetResource={handleGetResource}
      onInteractWithContract={handleInteractWithContract}
      onSignMessage={handleSignMessage}
      onSendTransactions={() => Promise.resolve({ transactionId: "" })}
      onSendScript={handleSendScript}
      argTypes={typeKeys}
      shouldClearScript
      isTransactionsExtraSignersAvailable
      isSandboxDisabled
      defaultTab={ScriptTypes.CONTRACT}
      disabledTabs={[ScriptTypes.TX]}
      tabsShouldLoadDefaultTemplate={[
        ScriptTypes.SCRIPT,
        ScriptTypes.CONTRACT,
        ScriptTypes.SIGN,
        ScriptTypes.RESOURCE,
      ]}
      faucetUrl="https://aptos-faucet.blocto.app/"
    />
  );
};

export default AptosEditor;
