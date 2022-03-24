import React, { useCallback, useEffect, useState } from "react";
import * as fcl from "@blocto/fcl";
import { ChainServices } from "../services";
import { Chains, ChainsType } from "../types/ChainTypes";
import User from "../types/User";
import { TabInfos } from "../components/Header";

export const Context: React.Context<{
  chain?: ChainsType;
  switchChain?: (chain: ChainsType) => void;
  address?: string;
  login?: () => Promise<string>;
}> = React.createContext({});

const ContextProvider: React.FC = ({ children }) => {
  const [chain, setChain] = useState<ChainsType>(TabInfos[0].chain);
  const [address, setAddress] = useState<string>();

  useEffect(
    () =>
      fcl.currentUser().subscribe((user: User) => {
        setAddress(user?.addr);
        ChainServices.setChainAddress(Chains.Flow, user?.addr);
      }),
    []
  );

  const switchChain = useCallback((newChain: ChainsType) => {
    setChain(newChain);
    const newAddress = ChainServices.getChainAddress(newChain);
    setAddress(newAddress || "");
  }, []);

  const login = useCallback(async () => {
    if (chain === Chains.Flow) {
      if (ChainServices.getChainAddress(Chains.Flow)) {
        fcl.unauthenticate();
      } else {
        fcl.authenticate();
      }
      return;
    }

    let accounts = [];
    if (chain === Chains.Solana) {
      const { bloctoSDK } = ChainServices[chain];
      accounts = await bloctoSDK?.solana?.request({ method: "connect" });
    } else {
      const { bloctoSDK } = ChainServices[chain];
      accounts = await bloctoSDK?.ethereum?.enable();
    }

    ChainServices.setChainAddress(chain, accounts[0]);
    setAddress(accounts[0]);
    return accounts[0];
  }, [chain]);

  return (
    <Context.Provider value={{ chain, switchChain, address, login }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
