import { BigNumber } from "bignumber.js";

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



export interface Computer {
  owner: string;
  index: number;
  computer_title: string;
  image_url: string;
  computer_specs: string;
  store_location: string;
  price: string;
  sold: string;
}

export interface CustomWindow extends Window {
  ethereum?: any;
}