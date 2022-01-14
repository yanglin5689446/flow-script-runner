import ScriptTypes from "../types/ScriptTypes";

export const getFUSDBalance = {
  type: ScriptTypes.SCRIPT,
  script: `
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

pub fun main (address: Address): UFix64 {
    let vaultRef = getAccount(address).getCapability(/public/fusdBalance)!.borrow<&FUSD.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow reference to the owner's Vault!")
    return vaultRef.balance
}
`,
  args: [{ type: "Address", comment: "address" }],
};

export const getBLTBalance = {
  type: ScriptTypes.SCRIPT,
  script: `
  import FungibleToken from 0x9a0766d93b6608b7
  import BloctoToken from 0x6e0797ac987005f5
  
  pub fun main (address: Address): UFix64 {
      let vaultRef = getAccount(address).getCapability(/public/bloctoTokenBalance)!.borrow<&BloctoToken.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow reference to the owner's Vault!")
      return vaultRef.balance
  }
    `,
  args: [{ type: "Address", comment: "address" }],
};

export const getTUSDTBalance = {
  type: ScriptTypes.SCRIPT,
  script: `
import FungibleToken from 0x9a0766d93b6608b7
import TeleportedTetherToken from 0xab26e0a07d770ec1

pub fun main (address: Address): UFix64 {
    let vaultRef = getAccount(address).getCapability(TeleportedTetherToken.TokenPublicBalancePath)!.borrow<&TeleportedTetherToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow reference to the owner's Vault!")
    return vaultRef.balance
}
    `,
  args: [{ type: "Address", comment: "address" }],
};

export const sendFUSD = {
  type: ScriptTypes.TX,
  script: `
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

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
}
`,
  args: [
    { type: "UFix64", comment: "amount" },
    { type: "Address", comment: "receipient" },
  ],
  shouldSign: true,
};

export const sendBLT = {
  type: ScriptTypes.TX,
  script: `
import FungibleToken from 0x9a0766d93b6608b7
import BloctoToken from 0x6e0797ac987005f5

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
}
  `,
  args: [
    { type: "UFix64", comment: "amount" },
    { type: "Address", comment: "receipient" },
  ],
  shouldSign: true,
};

export const sendTUSDT = {
  type: ScriptTypes.TX,
  script: `
import FungibleToken from 0x9a0766d93b6608b7
import TeleportedTetherToken from 0xab26e0a07d770ec1

transaction(amount: UFix64, to: Address) {
    let sentVault: @FungibleToken.Vault
    prepare(signer: AuthAccount) {
        let vaultRef = signer.borrow<&TeleportedTetherToken.Vault>(from: TeleportedTetherToken.TokenStoragePath)
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {
        let recipient = getAccount(to)
        let receiverRef = recipient.getCapability(TeleportedTetherToken.TokenPublicReceiverPath)!.borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")
        receiverRef.deposit(from: <-self.sentVault)
    }
}
    `,
  args: [
    { type: "UFix64", comment: "amount" },
    { type: "Address", comment: "receipient" },
  ],
  shouldSign: true,
};
