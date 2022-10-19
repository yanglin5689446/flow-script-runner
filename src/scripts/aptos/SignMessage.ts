import ScriptTypes, { AptosArgTypes } from "../../types/ScriptTypes";

export const signMessage = {
  type: ScriptTypes.SIGN,
  script: "",
  args: [
    { type: AptosArgTypes.String, comment: "message", name: "message" },
    { type: AptosArgTypes.String, comment: "nonce", name: "nonce" },
    {
      type: AptosArgTypes.Bool,
      comment: "address (Optional)",
      name: "address",
    },
    {
      type: AptosArgTypes.Bool,
      comment: "chainId (Optional)",
      name: "chainId",
    },
    {
      type: AptosArgTypes.Bool,
      comment: "application (Optional)",
      name: "application",
    },
  ],
  isArgsAdjustable: false,
};
