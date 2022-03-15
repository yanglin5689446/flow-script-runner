import React, { useCallback, useState } from "react";
import { bloctoSDK } from "../services";

export const UserContext: React.Context<{
  ethAddress?: string;
  login?: () => Promise<string>;
}> = React.createContext({});

const EvmUserContext: React.FC = ({ children }) => {
  const [ethAddress, setEthAddress] = useState<string>();

  const login = useCallback(async () => {
    const accounts = await bloctoSDK.ethereum.enable();
    setEthAddress(accounts[0]);
    return accounts[0];
  }, []);

  return (
    <UserContext.Provider value={{ ethAddress, login }}>
      {children}
    </UserContext.Provider>
  );
};

export default EvmUserContext;
