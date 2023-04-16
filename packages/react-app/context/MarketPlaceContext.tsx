import { Computer, CustomWindow } from "@/typings";
import { ethers } from "ethers";
import {
  createContext,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ComputerMarketplaceAbi,
  ComputerMarketplaceContract,
  erc20Abi,
} from "./constants";

type MarketPlaceProviderProps = {
  children: React.ReactNode;
};

type MarketPlaceContextType = {
  getProducts: () => Promise<Computer[]>;
  fetchContract: (
    signerOrProvider: ethers.Signer | ethers.providers.Provider
  ) => ethers.Contract;
  computers: Computer[];
  myProducts: Computer[];
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
  deleteProduct: (index: number) => void;
};




export const MarketPlaceContext = createContext({} as MarketPlaceContextType);

export function useMarketPlace() {
  return useContext(MarketPlaceContext);
}

// var window: Window & typeof globalThis & CustomWindow;
const celoContractAddress: string =
  "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";



export default function MarketPlaceProvider({
  children,
}: MarketPlaceProviderProps) {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [myProducts, setMyProducts] = useState<Computer[]>([]);

  const fetchContract = useCallback(
    (signerOrProvider: ethers.Signer | ethers.providers.Provider) =>
      new ethers.Contract(
        ComputerMarketplaceContract,
        ComputerMarketplaceAbi,
        signerOrProvider
      ),
    []
  );

  const getProducts = useCallback(
    async function (): Promise<Computer[]> {
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
      const products = await Promise.all(_products);
      return products as Computer[];
    },
    [fetchContract]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setComputers(data);
      console.log(data);
    };
    fetchProducts();
  }, [getProducts]);

  const fetchMyProducts = useCallback(async function () {
    try {
      const provider = new ethers.providers.Web3Provider(
        (window as CustomWindow).ethereum
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ComputerMarketplaceContract,
        ComputerMarketplaceAbi,
        signer
      );
      const accounts = await (window as CustomWindow).ethereum.request({
        method: "eth_accounts",
      });
      const currentUser = accounts[0];
      const products = await contract.getProductsByUser(currentUser);
      return products;
    } catch (err) {
      console.error(err);
    }
  }, []);

  //get my products
  useEffect(() => {
    fetchMyProducts().then((data) => {
      setMyProducts(data);
      console.log(data);
    });
  }, [fetchMyProducts]);

  //define constants

  const getsigner = async () => {
    if (!(window as CustomWindow).ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    await (window as CustomWindow).ethereum.enable();
    const provider = new ethers.providers.Web3Provider(
      (window as CustomWindow).ethereum
    );
    const signer = provider.getSigner();
    return signer;
  };

  //define functions
  async function approvePrice(price: string) {
    if (!(window as CustomWindow).ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    await (window as CustomWindow).ethereum.enable();
    const provider = new ethers.providers.Web3Provider(
      (window as CustomWindow).ethereum
    );
    const signer = provider.getSigner();
    const celoContract = new ethers.Contract(
      celoContractAddress,
      erc20Abi,
      signer
    );

    const result = await celoContract.approve(
      ComputerMarketplaceContract,
      price,
      {
        from: await signer.getAddress(),
      }
    );
    return result;
  }

  async function buyProduct(index: number, price: string) {
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
    } catch (error: any) {
      throw new Error(`Purchase failed: ${error.message}`);
    }
  }
  // define event handler
  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("buyBtn")) return;

    const index: number = parseInt(target.getAttribute("data-index")!);
    const product: Computer = computers[index];

    if (!(window as CustomWindow).ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    // prompt user to approve payment
    alert(`⌛ Waiting for payment approval for "${product.computer_title}"...`);
    try {
      await approvePrice(product.price);
    } catch (error: any) {
      alert(`⚠️ ${error.message}`);
      return;
    }

    // prompt user to confirm purchase
    const confirmMsg: string = `Are you sure you want to buy "${product.computer_title}" for ${product.price} CELO?`;
    if (!confirm(confirmMsg)) return;

    // process purchase
    alert(`⌛ Processing purchase for "${product.computer_title}"...`);
    try {
      await buyProduct(index, product.price);
      alert(`🎉 You successfully bought "${product.computer_title}".`);
      getProducts();
    } catch (error: any) {
      alert(`⚠️ ${error.message}`);
    }
  }

  
  async function deleteProduct(index: number) {
    const provider = new ethers.providers.Web3Provider(
      (window as CustomWindow).ethereum
    );
    const signer = provider.getSigner();
    const account = signer.getAddress();
    const contract = new ethers.Contract(
      ComputerMarketplaceContract,
      ComputerMarketplaceAbi,
      signer
    );
    try {
      const tx = await contract.deleteProduct(index);
      await tx.wait();
      alert("Product deleted successfully");
      // Refresh the list of my products

      const products = await contract.getProductsByUser(account);
      setMyProducts(products);
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }

  return (
    <MarketPlaceContext.Provider
      value={{
        getProducts,
        fetchContract,
        handleClick,
        computers,
        myProducts,
        deleteProduct,
      }}
    >
      {children}
    </MarketPlaceContext.Provider>
  );
}
