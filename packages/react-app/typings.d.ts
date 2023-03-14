export interface computerAbi {
  inputs: {
    internalType: string;
    name: string;
    type: string;
  }[];
  name: string;
  outputs: {
    internalType: string;
    name: string;
    type: string;
  }[];
  stateMutability: string;
  type: string;
  [];
}

export interface Summary {
  name: string;
  address: string;
  celo: BigNumber;
  balances: { symbol: StableToken; value?: BigNumber; error?: string }[];
}