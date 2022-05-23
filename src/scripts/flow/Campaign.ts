import ScriptTypes from "../../types/ScriptTypes";
import getAddress from "../../utils/getAddress";

export const getTokens = {
  type: ScriptTypes.SCRIPT,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

pub fun main(): { String: BloctoPrize.Token } {
  return BloctoPrize.getTokens()
}`,
  args: [],
};

export const getCampaigns = {
  type: ScriptTypes.SCRIPT,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

pub fun main(): [BloctoPrize.Campaign] {
  return BloctoPrize.getCampaigns()
}`,
  args: [],
};

export const getCampaign = {
  type: ScriptTypes.SCRIPT,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

pub fun main(id: Int): BloctoPrize.Campaign {
  return BloctoPrize.getCampaign(id: id)
}`,
  args: [{ type: "Int", comment: "Campaign id" }],
};

export const createCampaign = {
  type: ScriptTypes.TX,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

transaction(title: String, description: String, bannerUrl: String?, partner: String?, partnerLogo: String?, startAt: UFix64?, endAt: UFix64?) {
  prepare(signer: AuthAccount) {
    let adminRef = signer.borrow<&BloctoPrize.Admin>(from: BloctoPrize.AdminStoragePath)
      ?? panic("Can't borrow admin ref")
    adminRef.createCampaign(
      title: title,
      description: description,
      bannerUrl: bannerUrl,
      partner: partner,
      partnerLogo: partnerLogo,
      startAt: startAt,
      endAt: endAt,
      cancelled: false
    )
  }
}`,
  args: [
    { type: "String", comment: "title" },
    { type: "String", comment: "description" },
    { type: "Optional(String)", comment: "visual url" },
    { type: "Optional(String)", comment: "partner name" },
    { type: "Optional(String)", comment: "partner logo url" },
    { type: "Optional(UFix64)", comment: "start time" },
    { type: "Optional(UFix64)", comment: "end time" },
  ],
  shouldSign: true,
};

export const updateCampaign = {
  type: ScriptTypes.TX,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

transaction(id: Int, title: String?, description: String?, bannerUrl: String?, partner: String?, partnerLogo: String?, startAt: UFix64?, endAt: UFix64?, cancelled: Bool?) {
  prepare(signer: AuthAccount) {
    let adminRef = signer.borrow<&BloctoPrize.Admin>(from: BloctoPrize.AdminStoragePath)
      ?? panic("Can't borrow admin ref")
    adminRef.updateCampaign(
      id: id,
      title: title,
      description: description,
      bannerUrl: bannerUrl,
      partner: partner,
      partnerLogo: partnerLogo,
      startAt: startAt,
      endAt: endAt,
      cancelled: cancelled
    )
  }
}`,
  args: [
    { type: "Int", comment: "id" },
    { type: "Optional(String)", comment: "title" },
    { type: "Optional(String)", comment: "description" },
    { type: "Optional(String)", comment: "visual url" },
    { type: "Optional(String)", comment: "partner name" },
    { type: "Optional(String)", comment: "partner logo url" },
    { type: "Optional(UFix64)", comment: "start time" },
    { type: "Optional(UFix64)", comment: "end time" },
    { type: "Optional(Bool)", comment: "cancel" },
  ],
  shouldSign: true,
};

export const addPrize = {
  type: ScriptTypes.TX,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

transaction(id: Int, name: String, amount: UFix64, tokenKey: String) {
  prepare(signer: AuthAccount) {
    let adminRef = signer.borrow<&BloctoPrize.Admin>(from: BloctoPrize.AdminStoragePath)
      ?? panic("Can't borrow admin ref")
    adminRef.addPrize(
      id: id,
      name: name,
      tokenKey: tokenKey,
      amount: amount,
    )
  }
}`,
  args: [
    { type: "Int", comment: "id" },
    { type: "String", comment: "prize name" },
    { type: "UFix64", comment: "prize token amount" },
    { type: "String", comment: "token key" },
  ],
  shouldSign: true,
};

export const addWinners = {
  type: ScriptTypes.TX,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

transaction(id: Int, addresses: [Address], prizeIndex: Int) {
  prepare(signer: AuthAccount) {
    let adminRef = signer.borrow<&BloctoPrize.Admin>(from: BloctoPrize.AdminStoragePath)
      ?? panic("Can't borrow admin ref")
    adminRef.addWinners(
      id: id,
      addresses: addresses,
      prizeIndex: prizeIndex
    )
  }
}`,
  args: [
    { type: "Int", comment: "campaign id" },
    {
      type: "Array(Address)",
      comment: 'winner addresses list (in "["0x123"]" format)',
    },
    { type: "Int", comment: "prize index (0,1,2,3 ...)" },
  ],
  shouldSign: true,
};

export const removeWinners = {
  type: ScriptTypes.TX,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

transaction(id: Int, addresses: [Address], prizeIndex: Int) {
  prepare(signer: AuthAccount) {
    let adminRef = signer.borrow<&BloctoPrize.Admin>(from: BloctoPrize.AdminStoragePath)
      ?? panic("Can't borrow admin ref")
    adminRef.removeWinners(
      id: id,
      addresses: addresses,
      prizeIndex: prizeIndex
    )
  }
}`,
  args: [
    { type: "Int", comment: "campaign id" },
    {
      type: "Array(Address)",
      comment: 'winner addresses list (in "["0x123"]" format)',
    },
    { type: "Int", comment: "prize index (0,1,2,3 ...)" },
  ],
  shouldSign: true,
};

export const initClaimer = {
  type: ScriptTypes.TX,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

transaction() {
  prepare(signer: AuthAccount) {
    let claimer <- BloctoPrize.initClaimer()
    signer.save(<- claimer, to: BloctoPrize.ClaimerStoragePath)
    signer.link<&BloctoPrize.Claimer{BloctoPrize.ClaimerPublic}>(BloctoPrize.ClaimerPublicPath, target: BloctoPrize.ClaimerStoragePath)
  }
}`,
  args: [],
  shouldSign: true,
};

export const claimPrizes = {
  type: ScriptTypes.TX,
  script: `
import BloctoPrize from ${getAddress("BloctoPrize")}

transaction(id: Int) {
  prepare(signer: AuthAccount) {
    let claimerRef = signer.borrow<&BloctoPrize.Claimer>(from: BloctoPrize.ClaimerStoragePath)
      ?? panic("Can't borrow claimer ref")
    claimerRef.claimPrizes(id: id)
  }
}`,
  args: [{ type: "Int", comment: "campaign id" }],
  shouldSign: true,
};
