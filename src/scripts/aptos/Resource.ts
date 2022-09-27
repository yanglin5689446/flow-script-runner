import ScriptTypes, { ArgTypes } from "../../types/ScriptTypes";

// @todo: use different endpoint according to env and move this elsewhere
const APTOS_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";

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
      type: ArgTypes.String,
      comment: "address",
    },
    {
      type: ArgTypes.String,
      comment: "resource key",
      value: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
    },
  ],
  isArgsAdjustable: false,
};
