import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Header from "./components/Header";
import Editor from "./components/Editor";

const App = (): ReactJSXElement => (
  <ChakraProvider>
    <Header />
    <Editor />
  </ChakraProvider>
);

export default App;
