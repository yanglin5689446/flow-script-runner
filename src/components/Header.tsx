import React, { ChangeEvent, useContext, useState } from "react";
import {
  Flex,
  Select,
  Tab,
  TabList,
  Tabs,
  useMediaQuery,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import LoginButton from "./LoginButton";
import { Chains } from "../types/ChainTypes";

export const TabInfos = [
  { name: "Flow", chain: Chains.Flow },
  { name: "EVM", chain: Chains.Ethereum },
  { name: "Solana", chain: Chains.Solana },
  { name: "Aptos", chain: Chains.Aptos },
];

const Header = (): ReactJSXElement => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isDesktop] = useMediaQuery("(min-width: 996px)");
  const { switchChain } = useContext(Context);

  const handleChange = (eventOrTabIndex: ChangeEvent | number) => {
    const index =
      typeof eventOrTabIndex === "number"
        ? eventOrTabIndex
        : +(eventOrTabIndex.target as HTMLInputElement).value;
    setCurrentTab(index);
    if (switchChain) {
      switchChain(TabInfos[index].chain);
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
      {isDesktop ? (
        <Tabs colorScheme="gray" onChange={handleChange}>
          <TabList border="none">
            {TabInfos.map(({ name }, index) => (
              <Tab
                key={name}
                fontWeight="bold"
                fontSize="1.5em"
                border="none"
                marginLeft="1em"
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
      ) : (
        <Select mr={3} onChange={handleChange} value={currentTab} flex={1}>
          {TabInfos.map(({ name }, index) => (
            <option key={name} value={index}>
              {name}
            </option>
          ))}
        </Select>
      )}

      <LoginButton />
    </Flex>
  );
};

export default Header;
