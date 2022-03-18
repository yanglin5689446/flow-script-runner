import { ChainServices } from "../../services";
import { EvmChain } from "../../types/ChainTypes";
import ScriptTypes from "../../types/ScriptTypes";

export const getValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  method: (
    account: string,
    args: { receipient: string; amount: string },
    chain: EvmChain
  ): Promise<string> =>
    ChainServices.getEvmChainContract(chain).methods.value().call(),
  args: [],
};

export const getValue2 = {
  type: ScriptTypes.CONTRACT,
  script: "",
  method: (
    account: string,
    args: { receipient: string; amount: string },
    chain: EvmChain
  ): Promise<string> =>
    ChainServices.getEvmChainContract(chain).methods.value2().call(),
  args: [],
};

export const setValue = {
  type: ScriptTypes.CONTRACT,
  script: "",
  method: (
    account: string,
    args: { value: string },
    chain: EvmChain
  ): Promise<any> =>
    ChainServices.getEvmChainContract(chain)
      .methods.setValue(Number(args.value))
      .send({
        from: account,
      }),
  args: [{ type: "String", comment: "value(number)", name: "value" }],
};

export const setValue2 = {
  type: ScriptTypes.CONTRACT,
  script: "",
  method: (
    account: string,
    args: { value: string },
    chain: EvmChain
  ): Promise<any> =>
    ChainServices.getEvmChainContract(chain)
      .methods.setValue2(Number(args.value))
      .send({
        from: account,
      }),
  args: [{ type: "String", comment: "value2(number)", name: "value" }],
};
