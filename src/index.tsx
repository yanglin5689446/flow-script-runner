import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as fcl from "@blocto/fcl";

fcl
  .config()
  .put("challenge.scope", "email") // request for Email
  .put("accessNode.api", "https://access-testnet.onflow.org") // Flow testnet
  .put(
    "discovery.wallet",
    "https://flow-wallet-testnet.blocto.app/api/flow/authn"
  ) // Blocto testnet wallet
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
