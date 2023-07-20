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

const MenuGroups = [{ title: "Request", templates: UserOperationTemplate }];

const EvmUserOpEditor = ({
  setRequestObject,
  account,
}: {
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
  account: string | null;
}): ReactJSXElement => {
  const [callData, setCallData] = useState<string>("");
  const [otherParam, setOtherParam] = useState<string[][]>([]);
  const importTemplate = useCallback((template: IUserOperationTemplate) => {
    setCallData(template.userOpObj.callData || "");
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

      <ParamEditor
        title="Other Param"
        param={otherParam}
        setParam={setOtherParam}
      />
    </Flex>
  );
};

export default EvmUserOpEditor;
