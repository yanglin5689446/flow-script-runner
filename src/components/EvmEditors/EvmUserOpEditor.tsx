import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import {
  Box,
  Flex,
  Textarea,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { EthereumTypes } from "@blocto/sdk";
import ParamEditor from "./ParamEditor";
import * as UserOperationTemplate from "../../scripts/evm/UserOperation";
import type { IUserOperationTemplate } from "../../scripts/evm/UserOperation";
import EvmSendEditor from "./EvmSendEditor";
import { AbiItem, numberToHex, isAddress, isHexStrict } from "web3-utils";
import Web3EthAbi from "web3-eth-abi";

const MenuGroups = [{ title: "Request", templates: UserOperationTemplate }];
const ABI: AbiItem = {
  inputs: [
    { internalType: "address", name: "dest", type: "address" },
    { internalType: "uint256", name: "value", type: "uint256" },
    { internalType: "bytes", name: "func", type: "bytes" },
  ],
  name: "execute",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

const EvmUserOpEditor = ({
  setRequestObject,
  account,
}: {
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
  account: string | null;
}): ReactJSXElement => {
  const [templateId, setTemplateId] = useState<string>("");
  const [callData, setCallData] = useState<string>("");
  const [otherParam, setOtherParam] = useState<string[][]>([]);

  const importTemplate = useCallback((template: IUserOperationTemplate) => {
    setTemplateId(template.id);
    setCallData(template.userOpObj.callData);
    setOtherParam(
      Object.entries(template.userOpObj)
        .filter(([key]) => key !== "callData")
        .map(([key, value]) => [key, String(value)])
    );
  }, []);

  useEffect(() => {
    if (account) {
      setRequestObject({
        method: "eth_sendUserOperation",
        params: [{ callData, ...Object.fromEntries(otherParam) }],
      });
    }
  }, [account, callData, otherParam, setRequestObject]);

  const setTransactionToCallData = useCallback(
    ([params]) => {
      const { to, value = "0x", data = "0x" } = params;

      if (!isAddress(to) || !isHexStrict(data)) return;

      const callData = Web3EthAbi.encodeFunctionCall(ABI, [
        to,
        numberToHex(value),
        data,
      ]);

      setCallData(callData);
      setRequestObject({
        method: "eth_sendUserOperation",
        params: [{ callData, ...Object.fromEntries(otherParam) }],
      });
    },
    [otherParam, setRequestObject]
  );

  return (
    <Flex flexDirection="column">
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="130px">
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
                  {template.name}
                </MenuItem>
              ))}
            </MenuGroup>
          ))}
        </MenuList>
      </Menu>

      {templateId === "sendTransaction" ? (
        <Box my="20px">
          <EvmSendEditor
            setRequestObject={setTransactionToCallData}
            account={account}
          />
        </Box>
      ) : (
        <Flex my="20px" alignItems="center">
          <Box mx="10px">callData:</Box>
          <Textarea
            rows={2}
            value={callData}
            onChange={(e) => {
              setCallData(e.target.value);
            }}
          />
        </Flex>
      )}

      <ParamEditor
        title="Other Param"
        params={otherParam}
        setParams={setOtherParam}
      />
    </Flex>
  );
};

export default EvmUserOpEditor;
