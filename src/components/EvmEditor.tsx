import React, { useCallback, useState } from "react";
import {
  useToast,
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { EvmChain } from "../types/ChainTypes";
import EvmChainSelect from "./EvmChainSelect";
import EvmRequestEditor from "./EvmEditors/EvmRequestEditor";
import EvmSignEditor from "./EvmEditors/EvmSignEditor";
import { EthereumTypes } from "@blocto/sdk";
import { bloctoSDK, useEthereum } from "../services/evm";
import ReactJson from "react-json-view";

const FaucetUrls = {
  [EvmChain.Ethereum]: "https://goerlifaucet.com/",
  [EvmChain.Bsc]: "https://testnet.binance.org/faucet-smart",
  [EvmChain.Polygon]: "https://faucet.polygon.technology/",
  [EvmChain.Avalanche]: "https://faucet.avax-test.network/",
  [EvmChain.Arbitrum]: "https://faucet.triangleplatform.com/arbitrum/goerli",
  [EvmChain.Optimism]: "https://faucet.paradigm.xyz/",
};

const EvmEditor = (): ReactJSXElement => {
  const { account, chainId, connect, disconnect } = useEthereum();
  const toast = useToast();

  const [requestObject, setRequestObject] =
    useState<EthereumTypes.EIP1193RequestPayload>();
  const sendRequest = useCallback(async () => {
    if (!requestObject) return;
    console.log(requestObject);
    try {
      const response = await bloctoSDK.ethereum.request(requestObject);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }, [requestObject]);

  const copyAddress = useCallback(() => {
    window.navigator.clipboard
      .writeText(account || "")
      .then(() =>
        toast({ title: "Address copied!", status: "success", duration: 2000 })
      );
  }, [account, toast]);

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
              <p>User Operation</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>

      <Flex
        justifyContent="space-between"
        flexDirection="column"
        width={{ base: "100%", md: "50%" }}
        p="10px"
        borderLeft="1px solid #E2E8F0"
      >
        <Box width="100%" overflow="scroll">
          <Box width="100%" minWidth="fit-content">
            <ReactJson
              src={requestObject as any}
              name={null}
              displayDataTypes={false}
              theme="tube"
            />
          </Box>
        </Box>

        <Button onClick={account ? sendRequest : connect}>
          {account ? "Send" : "Connect"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default EvmEditor;
