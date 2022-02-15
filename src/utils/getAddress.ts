export default function getAddress(key: string): string {
  if (process.env.REACT_APP_NETWORK === "mainnet") {
    switch (key) {
      case "FlowToken":
        return "0x1654653399040a61";
      case "BloctoDAO":
        return "0xe0f601b5afd47581";
      case "FungibleToken":
        return "0xf233dcee88fe0abe";
      case "FUSD":
        return "0x3c5959b568896393";
      case "BloctoToken":
        return "0x0f9df91c9121c460";
      case "TeleportedTetherToken":
        return "0x78fea665a361cf0e";
      default:
        return "";
    }
  } else {
    switch (key) {
      case "FlowToken":
        return "0x7e60df042a9c0868";
      case "BloctoDAO":
        return "0x18cce040948c8c91";
      case "FungibleToken":
        return "0x9a0766d93b6608b7";
      case "FUSD":
        return "0xe223d8a629e49c68";
      case "BloctoToken":
        return "0x6e0797ac987005f5";
      case "TeleportedTetherToken":
        return "0xab26e0a07d770ec1";
      default:
        return "";
    }
  }
}
