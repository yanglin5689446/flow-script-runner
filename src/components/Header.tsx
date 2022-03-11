import React from "react";
import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import LoginButton from "./LoginButton";

const TabNames = ["Flow Script Runner", "EVM Runner"];

const Header: React.FC<{
  currentTab: number;
  setCurrentTab: (index: number) => void;
}> = ({ currentTab, setCurrentTab }): ReactJSXElement => {
  return (
    <Flex
      height={76}
      px={3}
      align="center"
      boxShadow="rgb(188 188 188 / 40%) 0px -0.5px 0px inset"
      justify="space-between"
    >
      <Tabs colorScheme="gray" onChange={setCurrentTab}>
        <TabList border="none">
          {TabNames.map((name, index) => (
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

      <LoginButton chain={currentTab === 0 ? "flow" : "ethereum"} />
    </Flex>
  );
};

export default Header;
