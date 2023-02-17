import ScriptTypes, { AptosArgTypes } from "../../types/ScriptTypes";

const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";

const APTOS_NODE_URL = `https://fullnode.${
  isMainnet ? "mainnet" : "testnet"
}.aptoslabs.com/v1`;

export const getAptosBalance = {
  type: ScriptTypes.RESOURCE,
  script: "",
  method: async (address: string, type: string): Promise<any> => {
    const result = await fetch(
      `${APTOS_NODE_URL}/accounts/${address}/resources`
    ).then((response) => response.json());
    const found = result.find((entry: any) => entry.type === type);
    return found?.data;
  },
  args: [
    {
      type: AptosArgTypes.String,
      comment: "address",
    },
    {
      type: AptosArgTypes.String,
      comment: "resource key",
      value: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    },
  ],
  isArgsAdjustable: false,
};
