import React, { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import * as types from "@onflow/types";
import * as AptosModulesTemplate from "../scripts/aptos/Modules";
import * as AptosResourceTemplate from "../scripts/aptos/Resource";
import ScriptTypes, { Arg, PerContractInfo } from "../types/ScriptTypes";
import Editor from "./Editor";

const typeKeys = Object.keys(types);

const MenuGroups = [
  { title: "Contract", templates: AptosModulesTemplate },
  { title: "Resource", templates: AptosResourceTemplate },
];

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

  const handleInteractWithContract = useCallback(
    async (
      contractInfo: Record<string, PerContractInfo>,
      args: Arg[] | undefined,
      method?: (...param: any[]) => Promise<any>
    ) => {
      return new Promise<{
        transactionId: string;
      }>((resolve, reject) => {
        try {
          method?.(args, contractInfo).then((hash) => resolve(hash));
        } catch (error) {
          reject(error);
          toast({
            title: "Transaction failed",
            status: "error",
            isClosable: true,
            duration: 1000,
          });
        }
      });
    },
    [toast]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onGetResource={handleGetResource}
      onInteractWithContract={handleInteractWithContract}
      onSendTransactions={() => Promise.resolve({ transactionId: "" })}
      argTypes={typeKeys}
      shouldClearScript
      isTransactionsExtraSignersAvailable
      isSandboxDisabled
      defaultTab={ScriptTypes.CONTRACT}
      disabledTabs={[ScriptTypes.SCRIPT, ScriptTypes.SIGN, ScriptTypes.TX]}
      tabsShouldLoadDefaultTemplate={[
        ScriptTypes.CONTRACT,
        ScriptTypes.RESOURCE,
      ]}
      faucetUrl="https://aptos-faucet.blocto.app/"
    />
  );
};

export default AptosEditor;
