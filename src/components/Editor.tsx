import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Flex,
  Link,
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
  Text,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { startCase } from "lodash";
import { Context } from "../context/Context";
import ScriptTypes, { Arg, PerContractInfo } from "../types/ScriptTypes";
import Sandbox from "./Sandbox";

const TabNames = [
  "Script",
  "Transaction",
  "Contract",
  "Sign Message",
  "Resource",
];

const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";
interface EditorProps {
  menuGroups: Array<{ title: string; templates: any }>;
  onSendTransactions: (
    args: Arg[] | undefined,
    shouldSign: boolean | undefined,
    signers: Array<{ privateKey: string; address: string }> | undefined,
    script: string,
    method?: (...param: any[]) => Promise<any>
  ) => Promise<{
    transactionId: string;
    transaction?: any;
    subscribeFunc?: (callback: (transaction: any) => void) => () => void;
    isSealed?: (transaction: any) => boolean;
  }>;
  argTypes?: string[];
  shouldClearScript?: boolean;
  isSandboxDisabled?: boolean;
  disabledTabs?: ScriptTypes[];
  defaultTab?: ScriptTypes;
  tabsShouldLoadDefaultTemplate?: ScriptTypes[];
  isTransactionsExtraSignersAvailable?: boolean;
  onSendScript?: (
    script: string,
    args?: Arg[],
    method?: (...param: any[]) => Promise<any>
  ) => Promise<string>;
  onSignMessage?: (
    args?: Arg[],
    method?: (...param: any[]) => Promise<any>
  ) => Promise<any>;
  faucetUrl?: string;
  onInteractWithContract?: (
    contractInfo: Record<string, PerContractInfo>,
    args?: Arg[],
    method?: (...param: any[]) => Promise<any>
  ) => Promise<any>;
  onGetResource?: (
    args?: Arg[],
    method?: (...param: any[]) => Promise<any>
  ) => Promise<any>;
}

const Editor: React.FC<EditorProps> = ({
  menuGroups,
  argTypes,
  shouldClearScript,
  isSandboxDisabled,
  disabledTabs,
  tabsShouldLoadDefaultTemplate,
  isTransactionsExtraSignersAvailable,
  defaultTab,
  onSendScript,
  onSignMessage,
  onSendTransactions,
  onInteractWithContract,
  onGetResource,
  faucetUrl,
  children,
}): ReactJSXElement => {
  const { chain } = useContext(Context);
  const methodRef = useRef<(...param: any[]) => Promise<any>>();
  const [shouldSign, setShouldSign] = useState<boolean>();
  const [isArgsAdjustable, setIsArgsAdjustable] = useState<boolean>(true);
  const [contractInfo, setContractInfo] =
    useState<Record<string, PerContractInfo>>();
  const [args, setArgs] = useState<Arg[]>();
  const [signers, setSigners] =
    useState<{ privateKey: string; address: string }[]>();
  const [scriptType, setScriptType] = useState<ScriptTypes>(ScriptTypes.SCRIPT);
  const [description, setDescription] = useState<string>();
  const [script, setScript] = useState<string>("");
  const [response, setResponse] = useState<any>(undefined);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const importTemplate = useCallback(
    (template) => {
      methodRef.current = template.method;
      setScriptType(template.type);
      setDescription(template.description);
      setScript(template.script);
      setContractInfo(template.contractInfo?.(chain));
      setArgs(template.args);
      setShouldSign(template.shouldSign);
      setIsArgsAdjustable(template.isArgsAdjustable ?? true);
    },
    [chain]
  );

  const handleTabChange = useCallback(
    (index) => {
      setScriptType(index);
      if (tabsShouldLoadDefaultTemplate?.includes(index)) {
        const currentGroup = menuGroups.find(
          (group) => group.title === TabNames[index]
        )?.templates;
        if (currentGroup) {
          const templates = Object.values(currentGroup);
          importTemplate(templates[0]);
        } else {
          setArgs([]);
        }
      }
    },
    [tabsShouldLoadDefaultTemplate, menuGroups, importTemplate]
  );

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
            if (response instanceof Error) {
              setError(`Error: ${response.message}`);
              return;
            }
            setResult(response);
          })
          .catch((error) => {
            setError(error?.message || "Error: Signing message failed.");
          });
      } else if (scriptType === ScriptTypes.TX) {
        onSendTransactions(args, shouldSign, signers, script, methodRef.current)
          .then(({ transactionId, transaction, subscribeFunc, isSealed }) => {
            setTxHash(transactionId);
            setResponse(transaction);

            if (subscribeFunc && isSealed) {
              const unsub = subscribeFunc((transaction: any) => {
                setResponse(transaction);
                if (isSealed(transaction)) {
                  unsub();
                }
              });
            }
          })
          .catch((error) => {
            setError(error?.message || "Error: Sending transaction failed.");
          });
      } else if (scriptType === ScriptTypes.CONTRACT) {
        if (onInteractWithContract && contractInfo) {
          onInteractWithContract(contractInfo, args, methodRef.current)
            .then((result) => {
              if (
                typeof result === "string" ||
                (result && !result.transactionId)
              ) {
                setResult(result);
              } else {
                setTxHash(result.transactionId);
                setResponse(result.transaction);
              }
            })
            .catch((error) => {
              setError(error?.message || "Error: Function called failed.");
            });
        }
      } else {
        if (onGetResource) {
          onGetResource(args, methodRef.current)
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
        }
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error: Execution failed."
      );
    }
  }, [
    scriptType,
    contractInfo,
    args,
    script,
    shouldSign,
    signers,
    onSendScript,
    onSignMessage,
    onSendTransactions,
    onInteractWithContract,
    onGetResource,
  ]);

  useEffect(() => {
    if (shouldClearScript) {
      setScript("");
      if (scriptType === ScriptTypes.SCRIPT) {
        setScriptType(defaultTab || ScriptTypes.TX);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldClearScript]);

  useEffect(() => {
    if (defaultTab) {
      setScriptType(defaultTab);
      handleTabChange(defaultTab);
    }
  }, [defaultTab, handleTabChange]);

  const displayResult = result !== "" ? result : response;
  const formattedDisplayResult =
    typeof displayResult === "string"
      ? displayResult
      : JSON.stringify(displayResult, null, 2);
  const resultTitle =
    result || error ? "Run result:" : `Response of tx ${txHash}:`;
  return (
    <Flex
      height="calc(100vh - 76px)"
      flexDirection={{ base: "column", md: "row" }}
    >
      {!isSandboxDisabled && (
        <Sandbox
          script={script}
          onScriptChange={(event) => setScript(event.target.value)}
          disabled={scriptType === ScriptTypes.SIGN}
          hasError={!!error}
          resultTitle={resultTitle}
          result={error || formattedDisplayResult}
        />
      )}

      <Flex flex={3} height="100%" direction="column">
        <Tabs size="md" onChange={handleTabChange} index={scriptType}>
          <TabList>
            {TabNames.map((tab, index) => (
              <Tab key={tab} hidden={!!disabledTabs?.includes(index)}>
                {tab}
              </Tab>
            ))}
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
            <MenuList maxHeight={400} overflow="auto">
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
        <Flex mx={4} my={2} whiteSpace="pre-wrap">
          <Text>{description}</Text>
        </Flex>

        {scriptType === ScriptTypes.CONTRACT && (
          <Box px={4} mb="6">
            <Flex align="center" mt={3} ml={1}>
              <Box fontWeight="bold">Contract info</Box>
            </Flex>
            <Box mt={2} ml={1}>
              {contractInfo &&
                Object.keys(contractInfo)?.map((key, index) => {
                  const { value, comment } = contractInfo[key];
                  return (
                    <Flex key={index} align="center" mt={2}>
                      <Text width="130px" marginRight={2}>
                        {startCase(comment)}
                      </Text>
                      <Textarea
                        flex="1"
                        rows={1}
                        value={value || ""}
                        onChange={(e) => {
                          const updated = {
                            ...contractInfo,
                            [key]: {
                              ...contractInfo[key],
                              value: e.target.value,
                            },
                          };
                          setContractInfo(updated);
                        }}
                        placeholder={comment}
                      />
                    </Flex>
                  );
                })}
            </Box>
          </Box>
        )}

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
                onClick={() =>
                  setArgs((args ?? []).concat({ value: "", type: "" }))
                }
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
                {argTypes && (
                  <Select
                    value={type}
                    onChange={(e) => {
                      const updated = args.slice();
                      updated.splice(index, 1, {
                        ...updated[index],
                        value,
                        type: e.target.value,
                      });
                      setArgs(updated);
                    }}
                    ml={2}
                    isDisabled={!isArgsAdjustable}
                  >
                    <option value="">--</option>
                    {argTypes.map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                    {!argTypes.includes(type) && type && (
                      <option value={type}>{type}</option>
                    )}
                  </Select>
                )}
                {isArgsAdjustable && (
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

        {!isMainnet && (
          <Flex p={3} mt="6" bg="gray.100" color="gray.500">
            <Text>
              Are you short of test tokens? Here comes the{" "}
              <Link
                href={faucetUrl}
                isExternal
                color="#e5c100"
                _focus={{ boxShadow: "none" }}
              >
                faucet
              </Link>{" "}
              for you to earn some free tokens! ✨✨
            </Text>
          </Flex>
        )}

        {isSandboxDisabled && (error || formattedDisplayResult) && (
          <Box flex={1} borderTopWidth={1} p={3} width="100vw">
            <Box fontWeight="bold" mt={3}>
              {resultTitle}
            </Box>
            <Box
              borderRadius=".5em"
              bgColor={!!error ? "#f8d7da" : "#d1e7dd"}
              color={!!error ? "#842029" : "#0f5132"}
              mt={1}
              p={3}
              whiteSpace="pre-wrap"
              maxHeight={{ base: 100, md: 200 }}
              overflow="auto"
            >
              {error || formattedDisplayResult}
            </Box>
          </Box>
        )}

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
