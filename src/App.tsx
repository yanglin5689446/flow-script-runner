import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Header from "./components/Header";
import Editor from "./components/Editor";

const App = (): ReactJSXElement => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ChakraProvider>
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <Editor />
    </ChakraProvider>
  );
};
export default App;
