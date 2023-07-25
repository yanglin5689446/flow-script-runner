import React, { useCallback, useContext } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import { formatAddress } from "../utils/formatAddress";
import { ArrowForwardIcon, ChevronDownIcon, CopyIcon } from "@chakra-ui/icons";
import { OtherChain } from "../types/ChainTypes";

const styles = {
  d: "flex",
  bgColor: "#32323D",
  borderRadius: 25,
  alignItems: "center",
  color: "white",
  px: 4,
  fontWeight: 600,
  minW: 110,
  h: "40px",
  transition: ".2s all",
  _hover: {
    opacity: 0.8,
  },
  _active: {
    transform: "scale(0.98)",
  },
};

const LoginButton = (): ReactJSXElement => {
  const { address, login, logout, chain } = useContext(Context);
  const toast = useToast();

  const copyAddress = useCallback(() => {
    window.navigator.clipboard
      .writeText(address || "")
      .then(() =>
        toast({ title: "Address copied!", status: "success", duration: 2000 })
      );
  }, [address, toast]);

  if (chain === OtherChain.Ethereum) {
    return <></>;
  }

  return address ? (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} {...styles}>
        {formatAddress(address)}
      </MenuButton>
      <MenuList>
        {/* @ts-expect-error-next-line */}
        <MenuItem command={<CopyIcon />} onClick={copyAddress}>
          Copy Address
        </MenuItem>
        {/* @ts-expect-error-next-line */}
        <MenuItem command={<ArrowForwardIcon />} onClick={logout}>
          Disconnect
        </MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button {...styles} onClick={login}>
      Connect Wallet
    </Button>
  );
};

export default LoginButton;
