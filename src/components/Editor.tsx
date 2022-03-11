import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  Tabs,
  Textarea,
  Switch,
  useToast,
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
import * as fcl from "@blocto/fcl";
import * as types from "@onflow/types";
import { AddIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { startCase } from "lodash";
import * as FlowSignMessageTemplates from "../scripts/flow/SignMessage";
import ScriptTypes from "../types/ScriptTypes";
import Sandbox from "./Sandbox";

const typeKeys = Object.keys(types);

interface FlowArg {
  value?: any;
  type: any;
  comment?: string;
}

function parseFlowArgTypeFromString(type: string): any {
  const striped = type.replaceAll(" ", "");
  const matched = striped.match(/(Array|Optional)(\(.*\))?$/);
  if (matched) {
    return types[matched[1]](
      parseFlowArgTypeFromString(matched[2].slice(1, -1))
    );
  } else {
    return types[striped];
  }
}

function parseFclArgs(args: FlowArg[] = []) {
  return args.map(({ value, type }): { value: any; xform: any } => {
    let fclArgType = types[type];
    if (!typeKeys.includes(type)) {
      value = isNaN(parseFloat(value)) ? eval(value) : value;
      fclArgType = parseFlowArgTypeFromString(type);
    } else if (type.includes("Int")) {
      value = parseInt(value);
    } else if (type.includes("Fix")) {
      value = parseFloat(value).toFixed(8);
    } else if (type === "Boolean") {
      value = JSON.parse(value);
    }
    return fcl.arg(value, fclArgType);
  });
}

interface EditorProps {
  menuGroups: Array<{ title: string; templates: any }>;
  shouldClearScript?: boolean;
  isSandboxHidden?: boolean;
  isScriptTabDisabled?: boolean;
  isSignMessagePreDefined?: boolean;
  signMessageArgs?: FlowArg[];
  onSendScript: (
    script: string,
    fclArgs?: Array<{ value: any; xform: any }>
  ) => Promise<string>;
  onSignMessage: (args?: FlowArg[]) => Promise<any>;
  onSendTransactions: (
    fclArgs: Array<{ value: any; xform: any }> | undefined,
    shouldSign: boolean | undefined,
    signers: Array<{ privateKey: string; address: string }> | undefined,
    script: string
  ) => Promise<{
    transactionId: string;
    transaction: any;
  }>;
}

const Editor: React.FC<EditorProps> = ({
  menuGroups,
  shouldClearScript,
  isSandboxHidden,
  isScriptTabDisabled,
  isSignMessagePreDefined,
  signMessageArgs,
  onSendScript,
  onSignMessage,
  onSendTransactions,
}): ReactJSXElement => {
  const toast = useToast();
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
    const fclArgs =
      scriptType !== ScriptTypes.SIGN && args ? parseFclArgs(args) : undefined;
    if (scriptType === ScriptTypes.SCRIPT) {
      onSendScript(script, fclArgs)
        .then(setResult)
        .catch((e: Error) => {
          setError(e.message);
        });
    } else if (scriptType === ScriptTypes.SIGN) {
      onSignMessage(args)
        .then((response: any) => {
          if (response?.message) {
            setError(`Error: ${response.message}`);
            return;
          }
          setResult(response);
        })
        .catch((e: Error) => {
          setError(e.message);
        });
    } else {
      onSendTransactions(fclArgs, shouldSign, signers, script)
        .then(({ transactionId, transaction }) => {
          setTxHash(transactionId);
          if (transaction != response) {
            setResponse(transaction);
          }
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Transaction failed",
            status: "error",
            isClosable: true,
            duration: 1000,
          });
        });
    }
  }, [
    scriptType,
    args,
    script,
    shouldSign,
    signers,
    response,
    toast,
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
        disabled={scriptType === ScriptTypes.SIGN}
        hasError={!!error}
        resultTitle={
          result || error ? "Run result:" : `Response of tx ${txHash}:`
        }
        result={
          error ||
          ((result || response) && JSON.stringify(result || response, null, 2))
        }
        isShown={!isSandboxHidden}
      />

      <Flex flex={3} height="100%" direction="column">
        <Tabs size="md" onChange={handleTabChange} index={scriptType}>
          <TabList>
            <Tab isDisabled={isScriptTabDisabled}>Script</Tab>
            <Tab>Transaction</Tab>
            <Tab>Sign Message</Tab>
          </TabList>
        </Tabs>
        <Flex m={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
          </Flex>
          <Box mt={2}>
            {args?.map(({ value, type, comment }, index) => (
              <Flex key={index} align="center" mt={2}>
                <Textarea
                  rows={1}
                  value={value || ""}
                  onChange={(e) => {
                    const updated = args.slice();
                    updated.splice(index, 1, { type, value: e.target.value });
                    setArgs(updated);
                  }}
                  placeholder={comment}
                />
                <Select
                  value={type}
                  onChange={(e) => {
                    const updated = args.slice();
                    updated.splice(index, 1, { value, type: e.target.value });
                    setArgs(updated);
                  }}
                  ml={2}
                  isDisabled={scriptType === ScriptTypes.SIGN}
                >
                  <option value="">--</option>
                  {typeKeys.map((key) => (
                    <option value={key} key={key}>
                      {key}
                    </option>
                  ))}
                  {!typeKeys.includes(type) && (
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
              </Flex>
            ))}
          </Box>
          {scriptType === ScriptTypes.TX && (
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
          {scriptType === ScriptTypes.TX && (
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
