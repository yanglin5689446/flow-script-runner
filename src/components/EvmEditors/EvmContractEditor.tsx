import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import {
  Box,
  Textarea,
  Grid,
  Flex,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import type { EthereumTypes } from "@blocto/sdk";
import { web3 } from "../../services/evm";
import * as ContractTemplate from "../../scripts/evm/Contract";

const MenuGroups = [{ title: "Contract", templates: ContractTemplate }];

const EvmContractEditor = ({
  setRequestObject,
  account,
  chainId,
}: {
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
  account: string | null;
  chainId: string | null;
}): ReactJSXElement => {
  const [requestMethod, setRequestMethod] = useState<string>("eth_call");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractAbi, setContractAbi] = useState<string>("");
  const [methodName, setMethodName] = useState<string>("");
  const [methodArgs, setMethodArgs] = useState<(string | number)[]>([]);
  const [placeholder, setPlaceholder] = useState<string[]>([""]);
  const importTemplate = useCallback(
    (template: {
      contractInfo: (chain: any) => Record<string, any>;
      args: { placeholder: string; value: string | number }[];
      method: string;
    }) => {
      setContractAddress(template.contractInfo(chainId).contractAddress.value);
      setContractAbi(template.contractInfo(chainId).contractAbi.value);
      setMethodName(template.contractInfo(chainId).methodName.value);
      setMethodArgs(template.args.map((arg) => arg.value));
      setPlaceholder(template.args.map((arg) => arg.placeholder));
      setRequestMethod(template.method);
    },
    [setContractAddress, setContractAbi, setMethodName, chainId]
  );

  useEffect(() => {
    if (account) {
      if (!contractAbi) return;
      const contract = new web3.eth.Contract(
        JSON.parse(contractAbi),
        contractAddress
      );
      let data;
      try {
        data = contract.methods[methodName](...methodArgs).encodeABI();
      } catch (e) {
        console.log(e);
        return;
      }
      const params: any[] = [
        {
          from: account,
          to: contractAddress,
          data: data,
        },
      ];
      if (requestMethod === "eth_call") {
        params.push("latest");
      }
      setRequestObject({
        method: requestMethod,
        params,
      });
    }
  }, [
    account,
    contractAddress,
    setRequestObject,
    requestMethod,
    contractAbi,
    methodName,
    methodArgs,
  ]);

  return (
    <>
      <Menu>
        <MenuButton
          mb="15px"
          as={Button}
          rightIcon={<ChevronDownIcon />}
          width="130px"
        >
          Templates
        </MenuButton>
        <MenuList maxHeight={400} overflow="auto">
          {MenuGroups.map((menuGroup) => (
            <MenuGroup key={menuGroup.title} title={menuGroup.title}>
              {Object.entries(menuGroup.templates).map(([name, template]) => (
                <MenuItem
                  key={name}
                  pl={5}
                  color="gray.700"
                  onClick={() => {
                    importTemplate(template);
                  }}
                >
                  {template.description}
                </MenuItem>
              ))}
            </MenuGroup>
          ))}
        </MenuList>
      </Menu>
      <Grid templateRows="repeat(4, min-content)" gap="10px">
        <Box fontWeight="bold">Method</Box>
        <RadioGroup
          value={requestMethod}
          onChange={(e) => {
            setRequestMethod(e);
          }}
        >
          <Flex gap="15px">
            <Radio value="eth_call">Read</Radio>
            <Radio value="eth_sendTransaction">Write</Radio>
          </Flex>
        </RadioGroup>
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
            rows={5}
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
                placeholder={placeholder[i]}
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
    </>
  );
};

export default EvmContractEditor;
