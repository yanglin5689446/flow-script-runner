import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import EvmEditor from "./components/EvmEditor";
import FlowEditor from "./components/FlowEditor";
import Header from "./components/Header";
import EvmUserContext from "./context/EvmUserConext";

const App = (): ReactJSXElement => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ChakraProvider>
      <EvmUserContext>
        <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {currentTab === 0 ? <FlowEditor /> : <EvmEditor />}
      </EvmUserContext>
    </ChakraProvider>
  );
};
export default App;
