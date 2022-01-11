import ScriptTypes from "../types/ScriptTypes";

export const getTopics = {
  type: ScriptTypes.SCRIPT,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

pub fun main(): [BloctoDAO.Topic] {
  return BloctoDAO.getTopics()
}
`,
};

export const getTopic = {
  type: ScriptTypes.SCRIPT,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

pub fun main(id: UInt64): BloctoDAO.Topic {
  return BloctoDAO.getTopic(id: id)
}
`,
  args: [{ type: "UInt64", comment: "topicId" }],
};

export const checkIsProposer = {
  type: ScriptTypes.SCRIPT,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

pub fun main(account: Address): Bool {
  let proposer = getAccount(account).getCapability(/public/bloctoDAOProposer).borrow<&BloctoDAO.Proposer>()
  return proposer != nil
}
`,
  args: [{ type: "Address", comment: "user address" }],
};

export const checkCanVote = {
  type: ScriptTypes.SCRIPT,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

pub fun main(address: Address, topicId: UInt64): Bool {
  let amount = BloctoDAO.getStakedBLT(address: address)
  let topic = BloctoDAO.getTopic(id: topicId)
  return amount >= topic.minVoteStakingAmount
}
`,
  args: [
    { type: "Address", comment: "user address" },
    { type: "UInt64", comment: "topicId" },
  ],
};

export const getVotedOptions = {
  type: ScriptTypes.SCRIPT,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

pub fun main(account: Address): { UInt64: Int } {
  let voterPublic = getAccount(account).getCapability(BloctoDAO.VoterPublicPath).borrow<&BloctoDAO.Voter{BloctoDAO.VoterPublic}>()
    ?? panic("Can't borrow voter public reference")

  return voterPublic.getVotedOptions()
}
`,
  args: [{ type: "Address", comment: "user address" }],
};

export const createTopic = {
  type: ScriptTypes.TX,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

transaction(title: String, description: String, options: [String], startAt: UFix64?, endAt: UFix64?, minVoteStakingAmount: UFix64?) {
  let proposer: &BloctoDAO.Proposer;
  prepare(signer: AuthAccount) {
    self.proposer = signer.getCapability(/public/bloctoDAOProposer).borrow<&BloctoDAO.Proposer>()
	    ?? panic("Could not borrow reference")
  }

  execute {
    self.proposer.addTopic(
      title: title,
      description: description, 
      options: options,
      startAt: startAt,
      endAt: endAt,
      minVoteStakingAmount: minVoteStakingAmount
    )
  }
}
`,
  args: [
    { type: "String", comment: "title" },
    { type: "String", comment: "description" },
    { type: "Array(String)", comment: "options" },
    { type: "Optional(UFix64)", comment: "start timestamp" },
    { type: "Optional(UFix64)", comment: "end timestamp" },
    { type: "Optional(UFix64)", comment: "min vote staking amount" },
  ],
  shouldSign: true,
};

export const vote = {
  type: ScriptTypes.TX,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

transaction(topicId: UInt64, optionIndex: Int) {
  let voter: &BloctoDAO.Voter
  prepare(signer: AuthAccount) {

    if signer.borrow<&BloctoDAO.Voter>(from: BloctoDAO.VoterStoragePath) == nil {
      signer.save(<- BloctoDAO.initVoter(), to: BloctoDAO.VoterStoragePath)
      signer.link<&BloctoDAO.Voter{BloctoDAO.VoterPublic}>(BloctoDAO.VoterPublicPath, target: BloctoDAO.VoterStoragePath)
      signer.link<&BloctoDAO.Voter>(BloctoDAO.VoterPath, target: BloctoDAO.VoterStoragePath)
    }

    self.voter = signer.getCapability(BloctoDAO.VoterPath).borrow<&BloctoDAO.Voter>()
	    ?? panic("Could not borrow voter reference")
  }

  execute {
    self.voter.vote(topicId: topicId, optionIndex: optionIndex)
  }
}
`,
  args: [
    { type: "UInt64", comment: "topicId" },
    { type: "Int", comment: "option index" },
  ],
  shouldSign: true,
};

export const count = {
  type: ScriptTypes.TX,
  script: `\
import BloctoDAO from 0x18cce040948c8c91

transaction(topicId: UInt64, maxSize: Int) {
  prepare() {
    BloctoDAO.count(topicId: topicId, maxSize: maxSize)
  }
}
`,
  args: [
    { type: "UInt64", comment: "topicId" },
    { type: "Int", comment: "optionIndex" },
  ],
  shouldSign: false,
};
