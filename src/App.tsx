import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import FlowEditor from "./components/FlowEditor";
import Header from "./components/Header";

const App = (): ReactJSXElement => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ChakraProvider>
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <FlowEditor />
    </ChakraProvider>
  );
};
export default App;
