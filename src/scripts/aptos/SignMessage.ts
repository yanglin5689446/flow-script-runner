import ScriptTypes, { AptosArgTypes } from "../../types/ScriptTypes";

export const signMessage = {
  type: ScriptTypes.SIGN,
  script: "",
  args: [
    {
      type: AptosArgTypes.String,
      comment: "message",
      name: "message",
      required: true,
    },
    {
      type: AptosArgTypes.String,
      comment: "nonce",
      name: "nonce",
      required: true,
    },
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
