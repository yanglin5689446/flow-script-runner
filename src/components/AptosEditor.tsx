import React, { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import * as fcl from "@blocto/fcl";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import * as types from "@onflow/types";
import * as AptosModulesTemplate from "../scripts/aptos/Modules";
import ScriptTypes, { Arg } from "../types/ScriptTypes";
import Editor from "./Editor";

const typeKeys = Object.keys(types);

const MenuGroups = [{ title: "Modules", templates: AptosModulesTemplate }];

const AptosEditor = (): ReactJSXElement => {
  const toast = useToast();

  // @todo: add implemetation
  const handleSignMessage = useCallback(() => {
    return Promise.resolve("");
  }, []);

  // @todo: add implemetation
  const handleSendTransactions = useCallback(async () => {
    return new Promise<{
      transactionId: string;
    }>((resolve, reject) => {
      try {
        resolve({
          transactionId: "0xfoo",
        });
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
  }, [toast]);

  return (
    <Editor
      menuGroups={MenuGroups}
      onSignMessage={handleSignMessage}
      onSendTransactions={handleSendTransactions}
      argTypes={typeKeys}
      shouldClearScript
      isTransactionsExtraSignersAvailable
      isSandboxDisabled
      defaultTab={ScriptTypes.CONTRACT}
      disabledTabs={[ScriptTypes.SCRIPT, ScriptTypes.TX]}
      tabsShouldLoadDefaultTemplate={[ScriptTypes.SIGN, ScriptTypes.CONTRACT]}
      faucetUrl="https://aptos-faucet.blocto.app/"
    />
  );
};

export default AptosEditor;
