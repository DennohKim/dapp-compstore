import Image from "next/image";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { ethers } from "ethers";
import { useMarketPlace } from "@/context/MarketPlaceContext";

type CartItemProps = {
  id: number;
  quantity: number;
};

export function CartItem({ id, quantity }: CartItemProps) {
  const { removeFromCart, cartQuantity } = useShoppingCart();
  const { computers, handleClick } = useMarketPlace();

  console.log(cartQuantity)

  const item = computers.find((i) => {
    //console.log("computers", i.index);
    return i.index === id;
  });
  
  // check if item is undefined or falsy
  if (!item) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex space-y-4 text-black">
        <Image alt="cart item" src={item.image_url} width="125" height="75" />
        <div className="m-3">
          <div>
            {item.computer_title.substring(0, 30)}
            {quantity > 1 && <span className="text-sm">x{quantity}</span>}
          </div>
          <div className="flex items-center">
            <p className="pr-2">Price: </p>
            <div className="text-md">
              {" "}
              {Number(ethers.utils.formatEther(item.price.toString())) *
                quantity}{" "}
              CELO
            </div>
          </div>
        </div>
        <div>
          <button
            className="border border-gray-900 rounded-full h-4 w-4 flex justify-center items-center font-medium cursor-pointer text-gray-900"
            onClick={() => removeFromCart(item.index)}
          >
            &times;
          </button>
        </div>
      </div>

      {cartQuantity > 0 ? (
        <button
          className="inline-flex content-center place-items-center rounded-full border border-[#250438] bg-[#250438] py-2 px-5 text-md font-medium text-snow hover:bg-[#8e24cc] buyBtn"
          onClick={handleClick}
          data-index={item.index}
        >
          Buy {cartQuantity} Computer{cartQuantity> 1 && "s"}
        </button>
      ) : (
        <p>
          Your cart is empty. <br /> Add some computers to your cart.
        </p>
      )}
    </div>
  );
}


