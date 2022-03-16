import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import { formatAddress } from "../utils/formatAddress";

const LoginButton = (): ReactJSXElement => {
  const { address, login } = useContext(Context);

  const status = address ? formatAddress(address) : "Connect";
  return (
    <Button colorScheme="blue" onClick={login}>
      {status}
    </Button>
  );
};

export default LoginButton;
