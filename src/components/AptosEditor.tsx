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

const NUMBERS = [AptosArgTypes.U8, AptosArgTypes.U16, AptosArgTypes.U32];

const formatArg = (type: AptosArgTypes, value: any): any => {
  if (NUMBERS.includes(type)) {
    return +value;
  }

  if (type === AptosArgTypes.Bool && value) {
    return JSON.parse(value.toLowerCase());
  }

  if (
    (type === AptosArgTypes.Array || type === AptosArgTypes.Object) &&
    value
  ) {
    try {
      return JSON.parse(value);
    } catch (error) {}
  }

  return value;
};

const formatSigningArgs = (args: Arg[] | undefined) => {
  return args?.reduce((initial: { [key: string]: any }, currentValue: Arg) => {
    if (currentValue.name) {
      initial[currentValue.name] = formatArg(
        currentValue.type,
        currentValue.value
      );
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
      resolve(aptos.signMessage(formatSigningArgs(args)));
    });
  }, []);

  const handleInteractWithContract = useCallback(
    async (
      contractInfo: Record<string, PerInfo>,
      args?: Arg[],
      method?: (...param: any[]) => Promise<any>
    ) => {
      return new Promise<string>((resolve, reject) => {
        const typeArgs = args
          ?.filter((arg: any) => arg.type === "type_arg")
          .map((arg: any) => arg.value);
        const normalArgs = args
          ?.filter((arg: any) => arg.type !== "type_arg")
          .map((arg: any) => formatArg(arg.type, arg.value));

        const { moduleName, method: moduleMethod } = contractInfo;
        const funcName = `${moduleName.value}::${moduleMethod.value}`;
        const transaction = {
          arguments: normalArgs,
          function: funcName,
          type: "entry_function_payload",
          type_arguments: typeArgs,
        };

        method?.(transaction)
          .then(({ hash }) => resolve(hash))
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
      scriptInfo?: Record<"bytecode", PerInfo>,
      scriptAbi?: Record<AptosScriptAbiKeys, PerScriptAbi>
    ) => {
      return new Promise<string>((resolve, reject) => {
        const typeArgs = args
          ?.filter((arg: any) => arg.type === "type_arg")
          .map((arg: any) => arg.value);
        const normalArgs = args
          ?.filter((arg: any) => arg.type !== "type_arg")
          .map((arg: any) => formatArg(arg.type, arg.value));

        if (!scriptInfo || !scriptAbi) {
          return reject("scriptInfo or scriptAbi is undefined");
        }

        const { bytecode } = scriptInfo;
        const abi = Object.keys(scriptAbi).reduce<Record<string, any>>(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (initial, currentValue: AptosScriptAbiKeys) => {
            initial[currentValue] = scriptAbi[currentValue].format
              ? scriptAbi[currentValue].format?.(scriptAbi[currentValue].value)
              : scriptAbi[currentValue].value;
            return initial;
          },
          {}
        );

        const transaction = {
          type: "script_payload",
          code: { bytecode: bytecode.value, abi },
          type_arguments: typeArgs,
          arguments: normalArgs,
        };

        method?.(transaction)
          .then(({ hash }) => resolve(hash))
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
      disabledTabs={[ScriptTypes.TX, ScriptTypes.USER_OPERATION]}
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
