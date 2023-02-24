import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import * as fcl from "@blocto/fcl";
import { ChainServices } from "../services";
import { Chains, ChainsType, EvmChain } from "../types/ChainTypes";
import User from "../types/User";
import { TabInfos } from "../components/Header";
import { verifyAccountProofSignature } from "../utils/verifyAccountProofSignature";

export enum LoginMethod {
  Authn,
  ProvableAuthn,
}

const generate32BytesNonce = () =>
  Array.from({ length: 64 })
    .map(() => Math.floor(Math.random() * 0xf).toString(16))
    .join("");

export const Context: React.Context<{
  chain?: ChainsType;
  switchChain?: (chain: ChainsType) => void;
  address?: string;
  login?: () => Promise<string>;
  confirmFlowLogin?: (loginMethod: LoginMethod, appDomainTag?: string) => void;
  logout?: () => void;
  isLoginModalOpen?: boolean;
  closeLoginModal?: () => void;
}> = React.createContext({});

const ContextProvider: React.FC = ({ children }) => {
  const [chain, setChain] = useState<ChainsType>(TabInfos[0].chain);
  const [address, setAddress] = useState<string>();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const toast = useToast();

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

  const logout = useCallback(async () => {
    if (chain === Chains.Flow) {
      if (ChainServices.getChainAddress(Chains.Flow)) {
        fcl.unauthenticate();
      }
      return;
    }

    if (chain in EvmChain) {
      const { bloctoSDK } = ChainServices[chain];
      await bloctoSDK?.ethereum?.request({ method: "eth_disconnect" });
    }
    if (chain === Chains.Solana) {
      const { bloctoSDK } = ChainServices[chain];
      await bloctoSDK?.solana?.request({ method: "disconnect" });
    }

    localStorage.removeItem("sdk.session");
    setAddress("");
  }, [chain]);

  const login = useCallback(async () => {
    if (chain === Chains.Flow) {
      if (!ChainServices.getChainAddress(Chains.Flow)) {
        setIsLoginModalOpen(true);
      }
      return;
    }

    let accounts = [];
    if (chain === Chains.Solana) {
      const { bloctoSDK } = ChainServices[chain];
      accounts = await bloctoSDK?.solana?.request({ method: "connect" });
    } else if (chain === Chains.Aptos) {
      const { bloctoSDK } = ChainServices[chain];
      const result = await bloctoSDK?.aptos?.connect();
      accounts = [result.address];
    } else {
      const { bloctoSDK } = ChainServices[chain];
      accounts = await bloctoSDK?.ethereum?.enable();
    }

    ChainServices.setChainAddress(chain, accounts[0]);
    setAddress(accounts[0]);
    return accounts[0];
  }, [chain]);

  const confirmFlowLogin = useCallback(
    async (loginMethod: LoginMethod, appIdentifier = "") => {
      if (loginMethod === LoginMethod.ProvableAuthn && appIdentifier) {
        fcl.config().put(
          "fcl.accountProof.resolver",
          () =>
            new Promise((resolve) => {
              resolve({ appIdentifier, nonce: generate32BytesNonce() });
            })
        );
      }

      if (!ChainServices.getChainAddress(Chains.Flow)) {
        fcl.authenticate().then((response: any) => {
          if (loginMethod === LoginMethod.Authn) {
            return; // Don't verify the signature
          }

          const { services = [] } = response || {};

          const accountProofService = services.find(
            (service: any) => service.type === "account-proof"
          );
          if (accountProofService) {
            verifyAccountProofSignature(
              appIdentifier,
              accountProofService.data
            ).then((isValid: boolean) => {
              if (!isValid) {
                toast({
                  title:
                    "Failed to verify the login signature. We will log the current user out.",
                  status: "error",
                  duration: 3000,
                });
                logout();
              }
            });
          }
        });
      }
    },
    [logout, toast]
  );

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <Context.Provider
      value={{
        chain,
        switchChain,
        address,
        login,
        confirmFlowLogin,
        logout,
        isLoginModalOpen,
        closeLoginModal,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
