import React, { useContext, useState } from "react";
import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import LoginButton from "./LoginButton";
import { Chains } from "../types/ChainTypes";

export const TabInfos = [
  { name: "Flow Script Runner", chain: Chains.Flow },
  { name: "EVM Runner", chain: Chains.Ethereum },
  { name: "Solana Runner", chain: Chains.Solana },
];

const Header = (): ReactJSXElement => {
  const [currentTab, setCurrentTab] = useState(0);
  const { switchChain } = useContext(Context);

  const handleChangeTab = (tabIndex: number) => {
    setCurrentTab(tabIndex);
    if (switchChain) {
      switchChain(TabInfos[tabIndex].chain);
    }
  };

  return (
    <Flex
      height={76}
      px={3}
      align="center"
      boxShadow="rgb(188 188 188 / 40%) 0px -0.5px 0px inset"
      justify="space-between"
    >
      <Tabs colorScheme="gray" onChange={handleChangeTab}>
        <TabList border="none">
          {TabInfos.map(({ name }, index) => (
            <Tab
              key={name}
              fontWeight="bold"
              fontSize="1.5em"
              border="none"
              marginLeft="2em"
              opacity={index === currentTab ? "1" : "0.4"}
              transform={index === currentTab ? "none" : "scale(0.95)"}
              _first={{ marginLeft: "0" }}
              _active={{}}
              _focus={{}}
            >
              {name}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <LoginButton />
    </Flex>
  );
};

export default Header;
