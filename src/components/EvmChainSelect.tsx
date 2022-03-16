import React, { useContext } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { startCase } from "lodash";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { UserContext } from "../context/EvmUserConext";
import { EvmChain } from "../types/ChainTypes";

const EvmChainSelect: React.FC = ({}): ReactJSXElement => {
  const { chain, switchChain } = useContext(UserContext);
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="130px">
        {startCase(chain)}
      </MenuButton>
      <MenuList>
        {Object.values(EvmChain).map((chain) => (
          <MenuItem
            key={chain}
            pl={5}
            color="gray.700"
            onClick={() => {
              if (switchChain) {
                switchChain(chain);
              }
            }}
          >
            {startCase(chain)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default EvmChainSelect;
