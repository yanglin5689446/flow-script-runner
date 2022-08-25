import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import Playground from "./components/Playground";
import ContextProvider from "./context/Context";

const App = (): ReactJSXElement => {
  return (
    <ChakraProvider>
      <ContextProvider>
        <Header />
        <Playground />
        <LoginModal />
      </ContextProvider>
    </ChakraProvider>
  );
};
export default App;
