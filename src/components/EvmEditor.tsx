import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useToast,
  Box,
  Button,
  Flex,
  Grid,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import EvmChainSelect from "./EvmChainSelect";
import EvmRequestEditor from "./EvmEditors/EvmRequestEditor";
import EvmSignEditor from "./EvmEditors/EvmSignEditor";
import EvmUserOpEditor from "./EvmEditors/EvmUserOpEditor";
import { EthereumTypes } from "@blocto/sdk";
import {
  bloctoSDK,
  useEthereum,
  supportedChains,
  dappAuth,
} from "../services/evm";
import ReactJson from "react-json-view";

const signMethod = [
  "eth_sign",
  "personal_sign",
  "eth_signTypedData",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
];

const EvmEditor = (): ReactJSXElement => {
  const { account, chainId, connect, disconnect } = useEthereum();
  const toast = useToast();

  const [requestObject, setRequestObject] =
    useState<EthereumTypes.EIP1193RequestPayload>();
  const [responseObject, setResponseObject] = useState<{
    type: "normal" | "sign";
    status: "info" | "warning" | "success" | "error";
    response: any;
  } | null>(null);
  const [responseVerify, setResponseVerify] = useState<Record<any, any> | null>(
    null
  );

  const sendRequest = useCallback(async () => {
    if (!requestObject) return;
    try {
      setResponseObject(null);
      const response = await bloctoSDK.ethereum.request(requestObject);
      console.log(response);
      if (response === null) {
        setResponseObject({
          type: "normal",
          status: "success",
          response: "Success",
        });
        return;
      }
      if (signMethod.includes(requestObject.method)) {
        setResponseObject({
          type: "sign",
          status: "success",
          response,
        });
        return;
      }
      setResponseObject({
        type: "normal",
        status: "success",
        response: response,
      });
    } catch (e: any) {
      console.log(e);
      setResponseObject({
        type: "normal",
        status: "error",
        response: { code: e.code, error: e.message },
      });
    }
  }, [requestObject, setResponseObject]);

  const copyAddress = useCallback(() => {
    window.navigator.clipboard
      .writeText(account || "")
      .then(() =>
        toast({ title: "Address copied!", status: "success", duration: 2000 })
      );
  }, [account, toast]);

  const faucet = useMemo(() => {
    return supportedChains.find((chain) => chain.chainId === chainId)?.faucet;
  }, [chainId]);

  useEffect(() => {
    setResponseObject(null);
    setResponseVerify(null);
  }, [requestObject]);

  return (
    <Flex
      width="100%"
      flexWrap="wrap"
      height={{ base: "auto", md: "calc(100vh - 76px)" }}
    >
      <Flex
        flexDirection="column"
        width={{ base: "100%", md: "50%" }}
        height="100%"
        overflow="scroll"
      >
        <Flex
          width="100%"
          p="10px"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          flexShrink={1}
        >
          <Stat mx="10px" maxWidth="200px">
            <StatLabel>Current ChainId</StatLabel>
            <StatNumber>
              {chainId}
              <Box
                as="span"
                ml="5px"
                fontSize="12px"
                fontWeight="regular"
                color="gray.800"
              >
                {parseInt(chainId || "5", 16)}
                {faucet && (
                  <Box
                    as="a"
                    href={faucet}
                    mx="7px"
                    color="blue"
                    fontSize="14px"
                    textDecoration="underline"
                  >
                    Faucet
                  </Box>
                )}
              </Box>
            </StatNumber>
            <StatHelpText>
              {account ? (
                <Flex align="center">
                  <Box
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {account}
                  </Box>
                  <CopyIcon onClick={copyAddress} cursor="pointer" />
                </Flex>
              ) : (
                "disconnected"
              )}
            </StatHelpText>
          </Stat>

          <Box flexShrink={0}>
            <EvmChainSelect />
          </Box>

          <Button onClick={account ? disconnect : connect} flexShrink={0}>
            {account ? "Disconnect" : "Connect"}
          </Button>
        </Flex>
        <Tabs size="md" isLazy={true} isFitted={true}>
          <TabList>
            <Tab>Sign</Tab>
            <Tab>Request</Tab>
            <Tab>Contract</Tab>
            <Tab>User Operation</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <EvmSignEditor
                setRequestObject={setRequestObject}
                account={account}
              />
            </TabPanel>
            <TabPanel>
              <EvmRequestEditor setRequestObject={setRequestObject} />
            </TabPanel>
            <TabPanel>
              <p>Contract</p>
            </TabPanel>
            <TabPanel>
              <EvmUserOpEditor
                setRequestObject={setRequestObject}
                account={account}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>

      <Grid
        templateRows="min-content min-content min-content auto min-content"
        gap="10px"
        width={{ base: "100%", md: "50%" }}
        p="10px"
        borderLeft="1px solid #E2E8F0"
        sx={{
          lineBreak: "anywhere",
        }}
      >
        <Box width="100%" overflow="scroll">
          Request
          <Box
            width="100%"
            minWidth="fit-content"
            borderRadius="md"
            bgColor="rgb(35, 31, 32)"
            p="5px"
          >
            <ReactJson
              src={
                account
                  ? (requestObject as any)
                  : { Error: "Please connect first" }
              }
              name={null}
              displayDataTypes={false}
              theme="tube"
              onEdit={(data) => {
                setRequestObject(data.updated_src as any);
              }}
              onAdd={(data) => {
                setRequestObject(data.updated_src as any);
              }}
              onDelete={(data) => {
                setRequestObject(data.updated_src as any);
              }}
            />
          </Box>
        </Box>

        <Box width="100%" overflow="scroll">
          Response
          {responseObject?.response && (
            <Alert
              status={responseObject.status}
              alignItems="flex-start"
              borderRadius="md"
            >
              <AlertIcon />
              {typeof responseObject?.response === "string" ? (
                <Box>{responseObject?.response}</Box>
              ) : (
                <ReactJson
                  src={responseObject?.response}
                  name={null}
                  displayDataTypes={false}
                  displayObjectSize={false}
                />
              )}
            </Alert>
          )}
          {responseObject?.type === "sign" && (
            <Box width="100%">
              <Button
                m="5px"
                onClick={async () => {
                  setResponseVerify(null);
                  const message =
                    requestObject?.method === "personal_sign"
                      ? requestObject?.params?.[0]
                      : requestObject?.params?.[1];
                  console.log(message, responseObject.response, account);
                  const verify = await dappAuth.isAuthorizedSigner(
                    message,
                    responseObject.response,
                    account
                  );
                  setResponseVerify({ isValidSignature: verify });
                }}
              >
                Verify Signature
              </Button>
            </Box>
          )}
        </Box>

        {responseVerify && (
          <Alert
            status={!responseVerify?.isValidSignature ? "error" : "success"}
            alignItems="flex-start"
            borderRadius="md"
          >
            <AlertIcon />
            <ReactJson
              src={responseVerify}
              name={null}
              displayDataTypes={false}
              displayObjectSize={false}
            />
          </Alert>
        )}

        <Button
          onClick={account ? sendRequest : connect}
          gridRowEnd={-1}
          alignSelf="end"
        >
          {account ? "Send" : "Connect"}
        </Button>
      </Grid>
    </Flex>
  );
};

export default EvmEditor;
