import { ContractInfos } from "../../contracts";
import { ChainServices } from "../../services";
import { Chains, ChainsType, OtherChain } from "../../types/ChainTypes";
import ScriptTypes, {
  ArgTypes,
  PerContractInfo,
} from "../../types/ScriptTypes";

export const transferAptosCoin = {
  type: ScriptTypes.CONTRACT,
  script: "",
  description: "Transfer Aptos coin to other address",
  method: (
    account: string,
    args: Record<string, any>,
    contractInfo: {
      moduleName: string;
      address: string;
    }
  ): Promise<any | { is_init: number; number: number }> => {
    return new Promise(async (resolve, reject) => {
      const { address } = contractInfo;
      try {
        resolve(address);
      } catch (error) {
        reject(error);
      }
    });
  },
  contractInfo: (chain: ChainsType): Record<string, PerContractInfo> => ({
    moduleName: {
      comment: "module name",
      value: ContractInfos[chain as OtherChain.Aptos].moduleName,
    },
    method: {
      comment: "method",
      value: "transfer",
    },
    struct: {
      comment: "types",
      value: JSON.stringify([
        { name: "receipient", type: "address" },
        { name: "value", type: "u64" },
      ]),
    },
  }),
  args: [
    {
      type: ArgTypes.TypeArg,
      comment: "coin type",
      value: "0x1::aptos_coin::AptosCoin",
    },
    { type: ArgTypes.Address, comment: "receipient", name: "receipient" },
    { type: ArgTypes.Number, comment: "value", name: "value" },
  ],
};
