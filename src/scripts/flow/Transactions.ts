import ScriptTypes from "../../types/ScriptTypes";
import getAddress from "../../utils/getAddress";

export const getFUSDBalance = {
  type: ScriptTypes.SCRIPT,
  script: `
import FungibleToken from ${getAddress("FungibleToken")}
import FUSD from ${getAddress("FUSD")}

pub fun main (address: Address): UFix64 {
    let vaultRef = getAccount(address).getCapability(/public/fusdBalance)!.borrow<&FungibleToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow reference to the owner's Vault!")
    return vaultRef.balance
}
`,
  args: [{ type: "Address", comment: "address" }],
};

export const getBLTBalance = {
  type: ScriptTypes.SCRIPT,
  script: `
  import FungibleToken from ${getAddress("FungibleToken")}
  import BloctoToken from ${getAddress("BloctoToken")}
  
  pub fun main (address: Address): UFix64 {
      let vaultRef = getAccount(address).getCapability(/public/bloctoTokenBalance)!.borrow<&FungibleToken.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow reference to the owner's Vault!")
      return vaultRef.balance
  }
    `,
  args: [{ type: "Address", comment: "address" }],
};

export const getTUSDTBalance = {
  type: ScriptTypes.SCRIPT,
  script: `
import FungibleToken from ${getAddress("FungibleToken")}
import TeleportedTetherToken from ${getAddress("TeleportedTetherToken")}

pub fun main (address: Address): UFix64 {
    let vaultRef = getAccount(address).getCapability(TeleportedTetherToken.TokenPublicBalancePath)!.borrow<&FungibleToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow reference to the owner's Vault!")
    return vaultRef.balance
}
    `,
  args: [{ type: "Address", comment: "address" }],
};

export const getFlowBalance = {
  type: ScriptTypes.SCRIPT,
  script: `
import FungibleToken from ${getAddress("FungibleToken")}
import FlowToken from ${getAddress("FlowToken")}

pub fun main (address: Address): UFix64 {
    let vaultRef = getAccount(address).getCapability(/public/flowTokenBalance)!.borrow<&FungibleToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow reference to the owner's Vault!")
    return vaultRef.balance
}
    `,
  args: [{ type: "Address", comment: "address" }],
};

export const sendFUSD = {
  type: ScriptTypes.TX,
  script: `\
import FungibleToken from ${getAddress("FungibleToken")}
import FUSD from ${getAddress("FUSD")}

transaction(amount: UFix64, to: Address) {
    let sentVault: @FungibleToken.Vault
    prepare(signer: AuthAccount) {
        let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
			?? panic("Could not borrow reference to the owner's Vault!")
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let recipient = getAccount(to)
        let receiverRef = recipient.getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()
			?? panic("Could not borrow receiver reference to the recipient's Vault")
        receiverRef.deposit(from: <-self.sentVault)
    }
}`,
  args: [
    { type: "UFix64", comment: "amount" },
    { type: "Address", comment: "receipient" },
  ],
  shouldSign: true,
};

export const sendBLT = {
  type: ScriptTypes.TX,
  script: `\
import FungibleToken from ${getAddress("FungibleToken")}
import BloctoToken from ${getAddress("BloctoToken")}

transaction(amount: UFix64, to: Address) {
    let sentVault: @FungibleToken.Vault
    prepare(signer: AuthAccount) {
        let vaultRef = signer.borrow<&BloctoToken.Vault>(from: /storage/bloctoTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let recipient = getAccount(to)
        let receiverRef = recipient.getCapability(/public/bloctoTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")
        receiverRef.deposit(from: <-self.sentVault)
    }
}`,
  args: [
    { type: "UFix64", comment: "amount" },
    { type: "Address", comment: "receipient" },
  ],
  shouldSign: true,
};

export const sendTUSDT = {
  type: ScriptTypes.TX,
  script: `\
import FungibleToken from ${getAddress("FungibleToken")}
import TeleportedTetherToken from ${getAddress("TeleportedTetherToken")}

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&TeleportedTetherToken.Vault>(from: TeleportedTetherToken.TokenStoragePath)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(TeleportedTetherToken.TokenPublicReceiverPath)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}`,
  args: [
    { type: "UFix64", comment: "amount" },
    { type: "Address", comment: "receipient" },
  ],
  shouldSign: true,
};

export const sendFlow = {
  type: ScriptTypes.TX,
  script: `\
import FungibleToken from ${getAddress("FungibleToken")}
import FlowToken from ${getAddress("FlowToken")}

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}`,
  args: [
    { type: "UFix64", comment: "amount" },
    { type: "Address", comment: "receipient" },
  ],
  shouldSign: true,
};
