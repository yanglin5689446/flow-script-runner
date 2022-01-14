import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as fcl from "@blocto/fcl";

const isMainnet = process.env.REACT_APP_NETWORK === "mainnet";
const NODE_URL = isMainnet
  ? "https://access-mainnet-beta.onflow.org"
  : "https://access-testnet.onflow.org";
const WALLET_URL = isMainnet
  ? "https://flow-wallet.blocto.app/api/flow/authn"
  : "https://flow-wallet-testnet.blocto.app/api/flow/authn";

fcl
  .config()
  .put("challenge.scope", "email") // request for Email
  .put("accessNode.api", NODE_URL)
  .put("discovery.wallet", WALLET_URL) // Blocto testnet wallet
  .put("discovery.wallet.method", "HTTP/POST")
  .put("service.OpenID.scopes", "email!");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
