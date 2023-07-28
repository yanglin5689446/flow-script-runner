import React, {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Box,
  Button,
  Flex,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import * as RequestTemplate from "../../scripts/evm/Request";
import { EthereumTypes } from "@blocto/sdk";
import ParamEditor from "./ParamEditor";

const MenuGroups = [{ title: "Request", templates: RequestTemplate }];

const EvmRequestEditor = ({
  setRequestObject,
}: {
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
}): ReactJSXElement => {
  const [method, setMethod] = useState<string>("");
  const [params, setParams] = useState<string[][]>([["", ""]]);
  const importTemplate = useCallback(
    (template: EthereumTypes.EIP1193RequestPayload) => {
      setMethod(template.method);
      setParams(Object.entries(template?.params?.[0] || {}));
    },
    []
  );
  useEffect(() => {
    setRequestObject({
      method,
      params: [Object.fromEntries(params)],
    });
  }, [method, params, setRequestObject]);

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
                  {name}
                </MenuItem>
              ))}
            </MenuGroup>
          ))}
        </MenuList>
      </Menu>

      <Flex ml={1} flexDirection="column" alignItems="flex-start">
        <Box fontWeight="bold" my="10px">
          Method
        </Box>
        <Textarea
          width="300px"
          rows={1}
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
          }}
          required={true}
          placeholder="name"
        />
      </Flex>

      <ParamEditor title="Params" params={params} setParams={setParams} />
    </Flex>
  );
};

export default EvmRequestEditor;
