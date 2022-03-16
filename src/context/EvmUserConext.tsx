import React, { useCallback, useState } from "react";
import { ChainServices } from "../services";
import { EvmChain } from "../types/ChainTypes";

export const UserContext: React.Context<{
  chain?: EvmChain;
  switchChain?: (chain: EvmChain) => void;
  ethAddress?: string;
  login?: () => Promise<string>;
}> = React.createContext({});

const EvmUserContext: React.FC = ({ children }) => {
  const [chain, setChain] = useState<EvmChain>(EvmChain.Ethereum);
  const [ethAddress, setEthAddress] = useState<string>();
  const { bloctoSDK } = ChainServices[chain];

  const switchChain = useCallback((newChain: EvmChain) => {
    setChain(newChain);
    const newAddress = ChainServices.getChainAddress(newChain);
    setEthAddress(newAddress || "");
  }, []);

  const login = useCallback(async () => {
    const accounts = await bloctoSDK.ethereum.enable();
    ChainServices.setChainAddress(chain, accounts[0]);
    setEthAddress(accounts[0]);
    return accounts[0];
  }, [bloctoSDK, chain]);

  return (
    <UserContext.Provider value={{ chain, switchChain, ethAddress, login }}>
      {children}
    </UserContext.Provider>
  );
};

export default EvmUserContext;
