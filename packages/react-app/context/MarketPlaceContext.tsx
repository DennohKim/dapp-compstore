import { Computer } from "@/typings";
import { useCelo } from "@celo/react-celo";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
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
import { useShoppingCart } from "./ShoppingCartContext";

type MarketPlaceProviderProps = {
  children: React.ReactNode;
};

type MarketPlaceContextType = {
  getProducts: () => Promise<Computer[]>;
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
  const { kit, address } = useCelo();
  const [computers, setComputers] = useState<Computer[]>([]);
  const [myProducts, setMyProducts] = useState<Computer[]>([]);
  const { cartQuantity, cartItems, removeFromCart } = useShoppingCart();

  const router = useRouter();


  const getProducts = useCallback(
    async function (): Promise<Computer[]> {
      const contract = new kit.connection.web3.eth.Contract(
        ComputerMarketplaceAbi as any,
        ComputerMarketplaceContract
      );

      const _productsLength = await contract.methods.getProductsLength().call();
      const _products = [];

      for (let i = 0; i < _productsLength; i++) {
        let _product = new Promise(async (resolve, reject) => {
          let p = await contract.methods.readProduct(i).call();
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
    [kit]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setComputers(data);
      console.log(data);
    };
    fetchProducts();
  }, [getProducts]);

  //get my products
  useEffect(() => {
    const fetchMyProducts = async function () {
      try {
        const contract = new kit.connection.web3.eth.Contract(
          ComputerMarketplaceAbi as any,
          ComputerMarketplaceContract
        );
        const products = await contract.methods
          .getProductsByUser(address)
          .call();
        return products;
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyProducts().then((data) => {
      setMyProducts(data);
      console.log(data);
    });
  }, [kit, address]);

  // define functions
  async function approvePrice(price: string) {
    if (!address) {
      alert("Please install the Celo Wallet to use this feature.");
      return;
    }
    const celoContract = new kit.connection.web3.eth.Contract(
      erc20Abi as any,
      celoContractAddress
    );

    const txObject = celoContract.methods
      .approve(ComputerMarketplaceContract, price)
      .send({ from: address });
    return txObject;
  }



  // define event handler
  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("buyBtn")) return;

    const index: number = parseInt(target.getAttribute("data-index")!);
    const product: Computer = computers[index];

    
    const cartItemsPrice = cartItems.reduce((total, cartItem) => {
         const item = computers.find((i: any) => i.index === cartItem.id);
         const itemPrice = item ? ethers.utils.formatEther(item.price) : "0";
         return total + parseFloat(itemPrice) * cartItem.quantity;
    }, 0);

    console.log("cartItemsPrice", cartItemsPrice);
    

    // const number = parseInt(product.price);
    // const convertedPrice = number * cartQuantity;
    // const price = String(convertedPrice);
    const price = ethers.utils.parseEther(cartItemsPrice.toString());
    const itemPrice = String(price);

    try {
      await approvePrice(itemPrice);
    } catch (error: any) {
      alert(`⚠️ ${error.message}`);
      return;
    }

    // prompt user to confirm purchase
    const confirmMsg: string = `Are you sure you want to buy "${product.computer_title}" for ${itemPrice} CELO?`;
    if (!confirm(confirmMsg)) return;

    // process purchase
    alert(`⌛ Processing purchase for "${product.computer_title}"...`);
    try {
      const contract = new kit.connection.web3.eth.Contract(
        ComputerMarketplaceAbi as any,
        ComputerMarketplaceContract
      );

       const tx = await contract.methods
         .buyProduct(product.index)
         .send({ from: address, value: itemPrice });
     
      alert(`🎉 You successfully bought "${product.computer_title}".`);

      removeFromCart(product.index);
      getProducts();
    } catch (error: any) {
      alert(`⚠️ ${error.message}`);
    }
  }



  async function deleteProduct(index: number) {
    try {
      const contract = new kit.connection.web3.eth.Contract(
        ComputerMarketplaceAbi as any,
        ComputerMarketplaceContract
      );
      const tx = await contract.methods
        .deleteProduct(index)
        .send({ from: address });
      alert("Product deleted successfully");

      // Refresh the list of my products
      const products = await contract.methods.getProductsByUser(address);
      setMyProducts(products);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }

  return (
    <MarketPlaceContext.Provider
      value={{
        getProducts,
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
