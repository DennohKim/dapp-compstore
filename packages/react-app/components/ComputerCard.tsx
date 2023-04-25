import { useShoppingCart } from '@/context/ShoppingCartContext';
import { Computer } from '@/typings';
import { ethers } from 'ethers';
import Image from 'next/image';
import { IoIosPin } from 'react-icons/io';


const ComputerCard = ({computer}: {computer: Computer}) => {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(computer.index);

 
  return (
    <div className="group flex flex-col space-y-6">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          width="300"
          height="300"
          src={computer.image_url}
          alt="computer"
          className="object-center group-hover:opacity-75 object-cover transform transition-all h-full w-full hover:scale-110 "
        />
      </div>
      <div className="tooltip " data-tip={computer.computer_title}>
        {" "}
        <h3 className="mt-4 text-md text-start font-semibold text-gray-700">
          {computer.computer_title.substring(0, 30)}...
        </h3>
        <div className="pt-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="pr-2">
              <IoIosPin />
            </div>
            <p className="text-sm"> {computer.store_location}</p>
          </div>
          <div className="font-bold">
            {ethers.utils.formatEther(computer.price.toString())} CELO
          </div>
        </div>
        <div className="mt-2">
          {quantity === 0 ? (
            <button
              onClick={() => increaseCartQuantity(computer.index)}
              className="w-full rounded-md py-2 px-4 text-white bg-purple-900"
            >
              {" "}
              + Add to Cart
            </button>
          ) : (
            <div className="flex flex-col items-center  gap-2">
              <div className="flex items-center  gap-2">
                <button
                  onClick={() => decreaseCartQuantity(computer.index)}
                  className="rounded-md py-2 px-4 text-white bg-purple-900"
                >
                  -
                </button>
                <div>
                  <span className="text-gray-700 font-bold">{quantity} </span>in
                  cart
                </div>
                <button
                  onClick={() => increaseCartQuantity(computer.index)}
                  className="rounded-md py-2 px-4 text-white bg-purple-900"
                >
                  +
                </button>
              </div>

              <div className="">
                <button
                  onClick={() => removeFromCart(computer.index)}
                  className="rounded-md mt-2 py-2 px-4 text-white bg-rose-500"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComputerCard