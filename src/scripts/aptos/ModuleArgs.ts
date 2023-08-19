import { AptosArgTypes } from "../../types/ScriptTypes";

export const MODULE_ARGS = {
  transferAptosCoin: [
    {
      type: AptosArgTypes.TypeArg,
      comment: "coin type",
      value: "0x1::aptos_coin::AptosCoin",
    },
    { type: AptosArgTypes.Address, comment: "recipient", name: "recipient" },
    { type: AptosArgTypes.U64, comment: "value", name: "value" },
  ],
  sendArguments: [
    {
      type: AptosArgTypes.Bool,
      comment: "bool",
      name: "bool",
      value: "false",
    },
    {
      type: AptosArgTypes.U8,
      comment: "u8",
      name: "u8",
      value: "123",
    },
    {
      type: AptosArgTypes.U64,
      comment: "u64",
      name: "u64",
      value: "123",
    },
    {
      type: AptosArgTypes.U128,
      comment: "u128",
      name: "u128",
      value: "123",
    },
    {
      type: AptosArgTypes.Address,
      comment: "address",
      name: "address",
      value:
        "0xdb0811ac77320edb8a76520cea79af8850d2e9ca56f6cbf81dbbfd1279abe99a",
    },
    {
      type: AptosArgTypes.String,
      comment: "vector<u8> (plain text)",
      name: "vector<u8> (plain text)",
      value: "abcde",
    },
    {
      type: AptosArgTypes.Array,
      comment: "vector<u8> (uint8 array)",
      name: "vector<u8> (uint8 array)",
      value: "[97, 98, 99, 100, 101]",
    },
    {
      type: AptosArgTypes.Array,
      comment: "vector<u64>",
      name: "vector<u64>",
      value: "[1, 2, 3]",
    },
    {
      type: AptosArgTypes.String,
      comment: "0x1::string::String",
      name: "0x1::string::String",
      value: "foo",
    },
  ],
  mintNFT: [
    {
      type: AptosArgTypes.String,
      comment: "Description",
      name: "value",
      value: "My hero",
    },
    {
      type: AptosArgTypes.String,
      comment: "Gender",
      name: "value",
      value: "Female",
    },
    {
      type: AptosArgTypes.String,
      comment: "Name",
      name: "value",
      value: "Phoenix Flamestride",
    },
    {
      type: AptosArgTypes.String,
      comment: "Race",
      name: "value",
      value: "Cinderkin",
    },
    {
      type: AptosArgTypes.String,
      comment: "URI",
      name: "value",
      value: "https://placedog.net/500?r",
    },
  ],
  sendTxWithNFT: [
    {
      type: AptosArgTypes.Object,
      comment: "Token address",
      name: "value",
      value:
        "0x551fbed4b345a137d850447e6306843fcdb27da49f44dea373a08d194075932f",
    },
    {
      type: AptosArgTypes.Object,
      comment: "Token address",
      name: "value",
      value:
        '["0x551fbed4b345a137d850447e6306843fcdb27da49f44dea373a08d194075932f","0x83ed72471daf45a685a81f68f43d5f7766479b886093c4643df07d785c1edfc1"]',
    },
  ],
  logGenerics: [
    {
      type: AptosArgTypes.TypeArg,
      comment: "Token address",
      name: "value",
      value:
        "0x4282ed29feb89781cd4da44a5bb1d23ff7e31a9dd64536233792efe78b4a494d::hero::Hero",
    },
    {
      type: AptosArgTypes.Object,
      comment: "Token address",
      name: "value",
      value:
        "0x551fbed4b345a137d850447e6306843fcdb27da49f44dea373a08d194075932f",
    },
    {
      type: AptosArgTypes.Object,
      comment: "Token address",
      name: "value",
      value:
        '["0x551fbed4b345a137d850447e6306843fcdb27da49f44dea373a08d194075932f","0x83ed72471daf45a685a81f68f43d5f7766479b886093c4643df07d785c1edfc1"]',
    },
  ],
  triggerError: [
    {
      type: AptosArgTypes.U64,
      comment: "Input below 100 can trigger an error",
      name: "value",
    },
  ],
};
