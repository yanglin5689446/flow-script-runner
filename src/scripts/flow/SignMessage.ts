import ScriptTypes from "../../types/ScriptTypes";

export const signMessage = {
  type: ScriptTypes.SIGN,
  script: "",
  args: [{ type: "String", comment: "message" }],
};
