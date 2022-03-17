import React, { useContext } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Context } from "../context/Context";
import { Chains } from "../types/ChainTypes";
import EvmEditor from "./EvmEditor";
import FlowEditor from "./FlowEditor";
import SolanaEditor from "./SolanaEditor";

const Playground = (): ReactJSXElement => {
  const { chain } = useContext(Context);

  if (chain === Chains.Flow) {
    return <FlowEditor />;
  }

  if (chain === Chains.Solana) {
    return <SolanaEditor />;
  }

  return <EvmEditor />;
};

export default Playground;
