import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  Tabs,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { startCase } from "lodash";
import * as FlowSignMessageTemplates from "../scripts/flow/SignMessage";
import ScriptTypes from "../types/ScriptTypes";
import Sandbox from "./Sandbox";

export interface FlowArg {
  value?: any;
  type: any;
  comment?: string;
  name?: string;
}

interface EditorProps {
  menuGroups: Array<{ title: string; templates: any }>;

  onSendTransactions: (
    fclArgs: FlowArg[] | undefined,
    shouldSign: boolean | undefined,
    signers: Array<{ privateKey: string; address: string }> | undefined,
    script: string,
    method?: (...param: any[]) => Promise<any>
  ) => Promise<{
    transactionId: string;
    transaction: any;
  }>;
  argTypes?: string[];
  shouldClearScript?: boolean;
  isSandboxDisabled?: boolean;
  isScriptTabDisabled?: boolean;
  isSignMessagePreDefined?: boolean;
  signMessageArgs?: FlowArg[];
  isArgsAdjustable?: boolean;
  isTransactionsExtraSignersAvailable?: boolean;
  onSendScript?: (
    script: string,
    fclArgs?: FlowArg[],
    method?: (...param: any[]) => Promise<any>
  ) => Promise<string>;
  onSignMessage?: (
    args?: FlowArg[],
    method?: (...param: any[]) => Promise<any>
  ) => Promise<any>;
}

const Editor: React.FC<EditorProps> = ({
  menuGroups,
  argTypes,
  shouldClearScript,
  isSandboxDisabled,
  isScriptTabDisabled,
  isSignMessagePreDefined,
  signMessageArgs,
  isArgsAdjustable,
  isTransactionsExtraSignersAvailable,
  onSendScript,
  onSignMessage,
  onSendTransactions,
  children,
}): ReactJSXElement => {
  const methodRef = useRef<(...param: any[]) => Promise<any>>();
  const [shouldSign, setShouldSign] = useState<boolean>();
  const [args, setArgs] = useState<FlowArg[]>();
  const [signers, setSigners] =
    useState<{ privateKey: string; address: string }[]>();
  const [scriptType, setScriptType] = useState<ScriptTypes>(ScriptTypes.SCRIPT);
  const [script, setScript] = useState<string>("");
  const [response, setResponse] = useState<any>(undefined);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  useEffect(() => {
    if (shouldClearScript) {
      setScript("");
      if (scriptType === ScriptTypes.SCRIPT) {
        setScriptType(ScriptTypes.TX);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldClearScript]);

  const handleTabChange = useCallback(
    (index) => {
      setScriptType(index);
      if (isSignMessagePreDefined && index === ScriptTypes.SIGN) {
        setScript("");
        setArgs(FlowSignMessageTemplates.signMessage.args);
      }
    },
    [isSignMessagePreDefined]
  );

  const importTemplate = useCallback((template) => {
    methodRef.current = template.method;
    setScriptType(template.type);
    setScript(template.script);
    setArgs(template.args);
    setShouldSign(template.shouldSign);
  }, []);

  const runScript = useCallback(async () => {
    setResponse("");
    setResult("");
    setError("");
    setTxHash("");
    try {
      if (scriptType === ScriptTypes.SCRIPT && onSendScript) {
        onSendScript(script, args, methodRef.current)
          .then(setResult)
          .catch((error) => {
            setError(error?.message || "Error: Running script failed.");
          });
      } else if (scriptType === ScriptTypes.SIGN && onSignMessage) {
        onSignMessage(args, methodRef.current)
          .then((response: any) => {
            if (response?.message) {
              setError(`Error: ${response.message}`);
              return;
            }
            setResult(response);
          })
          .catch((error) => {
            setError(error?.message || "Error: Signing message failed.");
          });
      } else {
        onSendTransactions(args, shouldSign, signers, script, methodRef.current)
          .then(({ transactionId, transaction }) => {
            setTxHash(transactionId);
            setResponse(transaction);
          })
          .catch((error) => {
            setError(error?.message || "Error: Sending transaction failed.");
          });
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error: Execution failed."
      );
    }
  }, [
    scriptType,
    args,
    script,
    shouldSign,
    signers,
    onSendScript,
    onSignMessage,
    onSendTransactions,
  ]);

  return (
    <Flex
      height="calc(100vh - 76px)"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Sandbox
        script={script}
        onScriptChange={(event) => setScript(event.target.value)}
        disabled={isSandboxDisabled || scriptType === ScriptTypes.SIGN}
        hasError={!!error}
        resultTitle={
          result || error ? "Run result:" : `Response of tx ${txHash}:`
        }
        result={
          error ||
          ((result || response) && JSON.stringify(result || response, null, 2))
        }
      />

      <Flex flex={3} height="100%" direction="column">
        <Tabs size="md" onChange={handleTabChange} index={scriptType}>
          <TabList>
            <Tab isDisabled={isScriptTabDisabled}>Script</Tab>
            <Tab>Transaction</Tab>
            <Tab>Sign Message</Tab>
          </TabList>
        </Tabs>
        <Flex mt={4} mx={4} mb={2}>
          {children}
        </Flex>
        <Flex m={4}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              width="130px"
            >
              Templates
            </MenuButton>
            <MenuList>
              {menuGroups.map((menuGroup) => (
                <MenuGroup key={menuGroup.title} title={menuGroup.title}>
                  {Object.entries(menuGroup.templates).map(
                    ([name, template]) => (
                      <MenuItem
                        key={name}
                        pl={5}
                        color="gray.700"
                        onClick={() => importTemplate(template)}
                      >
                        {startCase(name)}
                      </MenuItem>
                    )
                  )}
                </MenuGroup>
              ))}
            </MenuList>
          </Menu>
        </Flex>

        <Box flex={1} px={4}>
          <Flex align="center" mt={3} ml={1}>
            <Box fontWeight="bold">Args</Box>
            {isArgsAdjustable && (
              <IconButton
                ml={2}
                aria-label="Add Args"
                isRound
                icon={<AddIcon />}
                size="xs"
                colorScheme="blue"
                onClick={() => {
                  const newArgs =
                    isSignMessagePreDefined && scriptType === ScriptTypes.SIGN
                      ? signMessageArgs
                      : (args ?? []).concat({ value: "", type: "" });
                  setArgs(newArgs);
                }}
              />
            )}
          </Flex>
          <Box mt={2}>
            {args?.map(({ value, type, comment, name }, index) => (
              <Flex key={index} align="center" mt={2}>
                <Textarea
                  rows={1}
                  value={value || ""}
                  onChange={(e) => {
                    const updated = args.slice();
                    updated.splice(index, 1, {
                      type,
                      comment,
                      name,
                      value: e.target.value,
                    });
                    setArgs(updated);
                  }}
                  placeholder={comment}
                />
                {isArgsAdjustable && argTypes && (
                  <>
                    <Select
                      value={type}
                      onChange={(e) => {
                        const updated = args.slice();
                        updated.splice(index, 1, {
                          value,
                          type: e.target.value,
                        });
                        setArgs(updated);
                      }}
                      ml={2}
                      isDisabled={scriptType === ScriptTypes.SIGN}
                    >
                      <option value="">--</option>
                      {argTypes.map((key) => (
                        <option value={key} key={key}>
                          {key}
                        </option>
                      ))}
                      {!argTypes.includes(type) && (
                        <option value={type}>{type}</option>
                      )}
                    </Select>
                    <IconButton
                      ml={2}
                      aria-label="Delete Arg"
                      isRound
                      icon={<CloseIcon />}
                      size="xs"
                      colorScheme="red"
                      onClick={() => {
                        const updated = args.slice();
                        updated.splice(index, 1);
                        setArgs(updated);
                      }}
                    />
                  </>
                )}
              </Flex>
            ))}
          </Box>
          {isTransactionsExtraSignersAvailable &&
            scriptType === ScriptTypes.TX && (
              <>
                <Flex align="center" mt={3} ml={1}>
                  <Box fontWeight="bold">Extra Signers</Box>
                  <IconButton
                    ml={2}
                    aria-label="Add Signers"
                    isRound
                    icon={<AddIcon />}
                    size="xs"
                    colorScheme="blue"
                    onClick={() =>
                      setSigners(
                        (signers ?? []).concat({ privateKey: "", address: "" })
                      )
                    }
                  />
                </Flex>
                <Box mt={2}>
                  {signers?.map(({ privateKey, address }, index) => (
                    <Flex key={index} align="center" mt={2}>
                      <Input
                        value={privateKey || ""}
                        onChange={(e) => {
                          const updated = signers.slice();
                          updated.splice(index, 1, {
                            address,
                            privateKey: e.target.value,
                          });
                          setSigners(updated);
                        }}
                        placeholder="private key"
                        type="password"
                      />
                      <Input
                        ml={2}
                        value={address || ""}
                        onChange={(e) => {
                          const updated = signers.slice();
                          updated.splice(index, 1, {
                            privateKey,
                            address: e.target.value,
                          });
                          setSigners(updated);
                        }}
                        placeholder="public key"
                      />
                      <IconButton
                        ml={2}
                        aria-label="Delete signers"
                        isRound
                        icon={<CloseIcon />}
                        size="xs"
                        colorScheme="red"
                        onClick={() => {
                          const updated = signers.slice();
                          updated.splice(index, 1);
                          setSigners(updated);
                        }}
                      />
                    </Flex>
                  ))}
                </Box>
              </>
            )}
        </Box>

        <Flex justify="end" p={4}>
          {isTransactionsExtraSignersAvailable &&
            scriptType === ScriptTypes.TX && (
              <FormControl
                display="flex"
                justifyContent="end"
                alignItems="center"
                mt={2}
                mx={3}
              >
                <FormLabel htmlFor="shouldSign" mb="0">
                  Authorize
                </FormLabel>
                <Switch
                  id="shouldSign"
                  isChecked={shouldSign}
                  onChange={(e) => setShouldSign(e.target.checked)}
                />
              </FormControl>
            )}
          <Button onClick={runScript} mt={2}>
            Run
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Editor;
