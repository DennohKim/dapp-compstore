import { useCelo } from "@celo/react-celo";
import { newKitFromWeb3 } from "@celo/contractkit";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { createContext, useEffect, useState } from "react";
import {
  ComputerMarketplaceAbi,
  ComputerMarketplaceContract,
  erc20Abi,
} from "./constants";


//Create marketplace context
export const MarketplaceContext = createContext();


let products = [];
const celoContractAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";

export const MarketplaceProvider = ({ children }) => {
  const [computers, setComputers] = useState([]);
  const [myProducts, setMyProducts] = useState([]);

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
          price: p[5],
          sold: p[6],
        });
      });
      _products.push(_product);
    }
    products = await Promise.all(_products);
    return products;
  };

  useEffect(() => {
    getProducts().then((data) => {
      setComputers(data);
      console.log(data);
    });
  }, []);

   async function fetchMyProducts() {
     try {
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer = provider.getSigner();
       const contract = new ethers.Contract(
         ComputerMarketplaceContract,
         ComputerMarketplaceAbi,
         signer
       );
       const accounts = await window.ethereum.request({
         method: "eth_accounts",
       });
       const currentUser = accounts[0];
       const products = await contract.getProductsByUser(currentUser);
       return products;
     } catch (err) {
       console.error(err);
     }
   }
   
  //get my products
  useEffect(() => {
    fetchMyProducts().then((data) => {
      setMyProducts(data);
      console.log(data);
    });
  }, []);
   

  

  //define constants
 
 const getsigner = async()=>{
  if (!window.ethereum) {
    alert("Please install MetaMask to use this feature.");
    return;
  }

  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return signer;

 }


  //define functions
  async function approvePrice(price) {
     if (!window.ethereum) {
       alert("Please install MetaMask to use this feature.");
       return;
     }

     await window.ethereum.enable();
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const celoContract = new ethers.Contract(
       celoContractAddress,
       erc20Abi,
       signer
     );

     const result = await celoContract.approve(
       ComputerMarketplaceContract, price,
       {
         from: await signer.getAddress(),
       }
     );
     return result;
  }

  async function buyProduct(index, price) {
    const signer = await getsigner();
    const contract = new ethers.Contract(
      ComputerMarketplaceContract,
      ComputerMarketplaceAbi,
      signer
    );


    try {
      const tx = await contract.buyProduct(index);
      await tx.wait();
      return true;
    } catch (error) {
      throw new Error(`Purchase failed: ${error.message}`);
    }
  }

  // define event handler
  async function handleClick(e) {
    if (!e.target.classList.contains("buyBtn")) return;

    const index = e.target.getAttribute("data-index");
    const product = products[index];

     if (!window.ethereum) {
       alert("Please install MetaMask to use this feature.");
       return;
     }

     await window.ethereum.enable();
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const contract = fetchContract(provider);

     const celoContract = new ethers.Contract(
       celoContractAddress,
       erc20Abi,
       signer
     );

    // prompt user to approve payment
    alert(`⌛ Waiting for payment approval for "${product.computer_title}"...`);
    try {
      await approvePrice(product.price);
    } catch (error) {
      alert(`⚠️ ${error.message}`);
      return;
    }

    // prompt user to confirm purchase
    const confirmMsg = `Are you sure you want to buy "${product.computer_title}" for ${product.price} CELO?`;
    if (!confirm(confirmMsg)) return;

    // process purchase
    alert(`⌛ Processing purchase for "${product.computer_title}"...`);
    try {
      await buyProduct(index, product.price);
      alert(`🎉 You successfully bought "${product.computer_title}".`);
      getProducts();
    } catch (error) {
      alert(`⚠️ ${error.message}`);
    }
  }


  return (
    <MarketplaceContext.Provider
      value={{
        getProducts,
        fetchContract,
        approvePrice,
        handleClick,
        computers, 
        myProducts
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
