export const storageAddress = "0x303C13949E481Fd09563b21082d431A0B5b02D6D"

export const storageABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "data_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_data",
        type: "string",
      },
    ],
    name: "DataSet",
    type: "event",
  },
  {
    inputs: [],
    name: "getData",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "data_",
        type: "string",
      },
    ],
    name: "setData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]
