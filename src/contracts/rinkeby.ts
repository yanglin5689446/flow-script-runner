import { AbiItem } from "web3-utils";

const contractAddress = "0xe4500382e9e060925Eb9f60Ede902E9098F426d7";
const contractAbi: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "value",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newValue", type: "uint256" }],
    name: "setValue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "value2",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newValue", type: "uint256" }],
    name: "setValue2",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "value", type: "uint256" }],
    name: "updateValue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "value", type: "uint256" }],
    name: "updateValue2",
    type: "event",
  },
];

export { contractAddress, contractAbi };
