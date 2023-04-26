import { useMarketPlace } from "@/context/MarketPlaceContext";
import { useShoppingCart } from "@/context/ShoppingCartContext";
import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { Fragment, useState } from "react";
import { HiShoppingCart } from "react-icons/hi";
import { CartItem } from "./CartItem";

export default function CheckoutModal() {
  const { cartItems, cartQuantity } = useShoppingCart();

  const { computers } = useMarketPlace();


  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className=" inset-0 flex items-center justify-center">
        <button
          onClick={openModal}
          className="relative flex justify-center items-center text-xl text-purple-900 rounded-full  h-12 w-12 border border-purple-900"
        >
          <HiShoppingCart />
          <div className="absolute  h-6 w-6 top-8 left-6 rounded-full bg-rose-700 flex justify-center items-center text-white text-sm">
            {cartQuantity}
          </div>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Cart
                  </Dialog.Title>
                  <div className="mt-2">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} {...item} />
                    ))}

                    <div className="ml-auto font-bold text-black text-md mt-4 ">
                      Total{" "}
                      {cartItems.reduce((total, cartItem) => {
                        const item = computers.find(
                          (i: any) => i.index === cartItem.id
                        );
                        const itemPrice = item
                          ? ethers.utils.formatEther(item.price)
                          : "0";
                        return (
                          total + parseFloat(itemPrice) * cartItem.quantity
                        );
                      }, 0)}
                      <span className="pl-2">CELO</span>
                    </div>
                  </div>

                 <div className="mt-4">
                    <button
                      type="button"
                      className="btn inline-flex justify-end rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-200"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
