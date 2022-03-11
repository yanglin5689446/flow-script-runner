import ScriptTypes from "../../types/ScriptTypes";
import { web3 } from "../../services/rinkeby";

export const signMessageEth = {
  type: ScriptTypes.SIGN,
  script: "",
  method: (message: string, account: string): Promise<any> =>
    web3.eth.sign(message, account),
  args: [{ type: "String", comment: "message" }],
};

export const signMessagePersonal = {
  type: ScriptTypes.SIGN,
  script: "",
  method: (message: string, account: string): Promise<any> =>
    // eslint-disable-next-line
    // @ts-ignore
    web3.eth.personal.sign(message, account),
  args: [{ type: "String", comment: "message" }],
};

export const signV3TypedData = {
  type: ScriptTypes.SIGN,
  script: "",
  method: (message: string, account: string): Promise<any> =>
    // eslint-disable-next-line
    // @ts-ignore
    web3.currentProvider?.request({
      method: "eth_signTypedData",
      params: [account, message],
      from: account,
    }),
  args: [
    {
      type: "String",
      comment: "message",
      value:
        '{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":4,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}}',
    },
  ],
};

export const signV4TypedData = {
  type: ScriptTypes.SIGN,
  script: "",
  method: (message: string, account: string): Promise<any> =>
    // eslint-disable-next-line
    // @ts-ignore
    web3.currentProvider?.request({
      method: "eth_signTypedData",
      params: [account, message],
      from: account,
    }),
  args: [
    {
      type: "String",
      comment: "message",
      value:
        '{"domain":{"chainId":4,"name":"Ether Mail","verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC","version":"1"},"message":{"contents":"Hello, Bob!","from":{"name":"Cow","wallets":["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826","0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF"]},"to":[{"name":"Bob","wallets":["0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB","0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57","0xB0B0b0b0b0b0B000000000000000000000000000"]}]},"primaryType":"Mail","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Group":[{"name":"name","type":"string"},{"name":"members","type":"Person[]"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person[]"},{"name":"contents","type":"string"}],"Person":[{"name":"name","type":"string"},{"name":"wallets","type":"address[]"}]}}',
    },
  ],
};
