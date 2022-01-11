import React from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import User from "../types/User";
import * as fcl from "@blocto/fcl";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const Header = (): ReactJSXElement => {
  const [user, setUser] = useState<User | undefined>();
  const signInOrOut = useCallback(() => {
    if (user?.loggedIn) {
      fcl.unauthenticate();
    } else {
      fcl.authenticate();
    }
  }, [user]);

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  return (
    <Flex
      height={76}
      px={3}
      align="center"
      boxShadow="rgb(188 188 188 / 40%) 0px -0.5px 0px inset"
      justify="space-between"
    >
      <Box fontWeight="bold" fontSize="1.5em">
        Flow Script Runner
      </Box>
      <Button colorScheme="blue" onClick={signInOrOut}>
        {user?.loggedIn ? user.addr : "Connect"}
      </Button>
    </Flex>
  );
};

export default Header;
