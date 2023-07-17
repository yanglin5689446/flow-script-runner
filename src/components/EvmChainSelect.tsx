import React, { useState } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { supportedChains, bloctoSDK, useEthereum } from "../services/evm";

const EvmChainSelect: React.FC = ({}): ReactJSXElement => {
  const { chainId: currentChainId } = useEthereum();
  const [chainName, setChainName] = useState(
    supportedChains.find(({ chainId }) => chainId === currentChainId)?.name ||
      "Ethereum Goerli"
  );
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="200px">
        {chainName}
      </MenuButton>
      <MenuList>
        {supportedChains.map(({ name, chainId }) => (
          <MenuItem
            key={chainId}
            pl={5}
            color="gray.700"
            onClick={() => {
              bloctoSDK.ethereum
                .request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId }],
                })
                .then(() => {
                  setChainName(name);
                });
            }}
          >
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default EvmChainSelect;
