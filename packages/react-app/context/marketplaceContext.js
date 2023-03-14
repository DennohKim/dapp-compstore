import { useCelo } from "@celo/react-celo";
import { newKitFromWeb3 } from "@celo/contractkit";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { createContext } from "react";
import {
  ComputerMarketplaceAbi,
  ComputerMarketplaceContract,
  erc20Abi
} from "./constants";
import Web3 from "web3";

// Function to create contract when the seller or creator is passed in

//Create marketplace context
export const MarketplaceContext = createContext();

let kit;
let products = [];
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
const ERC20_DECIMALS = 18;


export const MarketplaceProvider = ({ children }) => {
  const { address } = useCelo();
 
  

  const fetchContract = (signerOrProvider) =>
    new ethers.Contract(
      ComputerMarketplaceContract,
      ComputerMarketplaceAbi,
      signerOrProvider
    );

 

  const getProducts = async function () {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    );
    const contract = fetchContract(provider);

    const _productsLength = await contract.getProductsLength();
    const _products = [];

    for (let i = 0; i < _productsLength; i++) {
      let _product = new Promise(async (resolve, reject) => {
        let p = await contract.readProduct(i);
        resolve({
          index: i,
          owner: p[0],
          computer_title: p[1],
          image_url: p[2],
          computer_specs: p[3],
          store_location: p[4],
          price:p[5],
          sold: p[6],
        });
      });
      _products.push(_product);
    }
    products = await Promise.all(_products);
    return products;
  };

  async function approve(_price) {
    const cUSDContract = new kit.web3.eth.Contract(
      erc20Abi,
      cUSDContractAddress
    );

    const result = await cUSDContract.methods
      .approve(ComputerMarketplaceContract, _price)
      .send({ from: address });
    return result;
  }

 

  return (
    <MarketplaceContext.Provider
      value={{
        getProducts,
        fetchContract,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
