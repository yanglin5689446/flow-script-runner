import React from "react";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as fcl from "@blocto/fcl";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { bloctoSDK } from "../services";
import User from "../types/User";

const LoginButton: React.FC<{
  chain: "flow" | "ethereum";
}> = ({ chain }): ReactJSXElement => {
  const [user, setUser] = useState<User>();
  const [ethAddress, setEthAddress] = useState<string>();

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  const signInOrOut = async () => {
    if (chain === "flow") {
      if (user?.loggedIn) {
        fcl.unauthenticate();
      } else {
        fcl.authenticate();
      }
    } else {
      if (!ethAddress) {
        const accounts = await bloctoSDK.ethereum.enable();
        setEthAddress(accounts[0]);
      }
    }
  };

  const status =
    (chain === "flow" && !user?.loggedIn) ||
    (chain === "ethereum" && !ethAddress)
      ? "Connect"
      : chain === "flow"
      ? user?.addr
      : ethAddress;
  return (
    <Button colorScheme="blue" onClick={signInOrOut}>
      {status}
    </Button>
  );
};

export default LoginButton;
