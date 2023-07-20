import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Box, Textarea, Grid, Flex, IconButton } from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import type { EthereumTypes } from "@blocto/sdk";
import { web3 } from "../../services/evm";

const EvmContractEditor = ({
  setRequestObject,
  account,
}: {
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
  account: string | null;
}): ReactJSXElement => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractAbi, setContractAbi] = useState<string>("");
  const [methodName, setMethodName] = useState<string>("");
  const [methodArgs, setMethodArgs] = useState<(string | number)[]>([]);
  useEffect(() => {
    if (account) {
      if (!contractAbi) return;
      const contract = new web3.eth.Contract(
        JSON.parse(contractAbi),
        contractAddress
      );
      setRequestObject({
        method: "eth_call",
        params: [
          {
            from: account,
            to: contractAddress,
            data: contract.methods[methodName](...methodArgs).encodeABI(),
          },
        ],
      });
    }
  }, [
    account,
    contractAddress,
    setRequestObject,
    contractAbi,
    methodName,
    methodArgs,
  ]);

  return (
    <Grid templateRows="repeat(4, min-content)" gap="10px">
      <Box fontWeight="bold">Contract info</Box>
      <Grid
        templateColumns="min-content 1fr"
        whiteSpace="nowrap"
        alignItems="center"
        gap="10px"
      >
        <Box mx="10px">Contract Address:</Box>
        <Textarea
          rows={1}
          value={contractAddress}
          onChange={(e) => {
            setContractAddress(e.target.value);
          }}
        />
        <Box mx="10px">Contract Abi:</Box>
        <Textarea
          rows={1}
          value={contractAbi}
          onChange={(e) => {
            setContractAbi(e.target.value);
          }}
        />
        <Box mx="10px">Method Name:</Box>
        <Textarea
          rows={1}
          value={methodName}
          onChange={(e) => {
            setMethodName(e.target.value);
          }}
        />
      </Grid>
      <Flex>
        <Box fontWeight="bold">Args</Box>
        <IconButton
          ml={2}
          aria-label="Add Signers"
          isRound
          icon={<AddIcon />}
          size="xs"
          colorScheme="blue"
          onClick={() => {
            setMethodArgs((prev) => [...prev, ""]);
          }}
        />
      </Flex>
      <Flex flexDir="column" mt={2}>
        {methodArgs?.map((p, i) => (
          <Flex key={i} my="5px" alignItems="center">
            <Textarea
              rows={1}
              value={p}
              onChange={(e) => {
                setMethodArgs((prev) => {
                  const newParam = [...prev];
                  newParam[i] = e.target.value;
                  return newParam;
                });
              }}
              required={i === 0}
              placeholder="value"
            />
            <IconButton
              ml={2}
              aria-label="Add Signers"
              isRound
              icon={<CloseIcon />}
              size="xs"
              colorScheme="red"
              onClick={() => {
                setMethodArgs((prev) => {
                  const newParam = [...prev];
                  newParam.splice(i, 1);
                  return newParam;
                });
              }}
            />
          </Flex>
        ))}
      </Flex>
    </Grid>
  );
};

export default EvmContractEditor;
