import React, { useContext, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import * as fcl from "@blocto/fcl";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import User from "../types/User";
import { UserContext } from "../context/EvmUserConext";

const LoginButton: React.FC<{
  chain: "flow" | "ethereum";
}> = ({ chain }): ReactJSXElement => {
  const { ethAddress, login } = useContext(UserContext);
  const [user, setUser] = useState<User>();

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
        if (login) {
          login();
        }
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
