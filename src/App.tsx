import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Header from "./components/Header";
import Playground from "./components/Playground";
import ContextProvider from "./context/Context";

const App = (): ReactJSXElement => {
  return (
    <ChakraProvider>
      <ContextProvider>
        <Header />
        <Playground />
      </ContextProvider>
    </ChakraProvider>
  );
};
export default App;
