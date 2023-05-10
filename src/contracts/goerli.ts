import { AbiItem } from "web3-utils";

const contractAddress = "0xFB9688306D687F16C6d658Fa2A04e0fB59071212";
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
