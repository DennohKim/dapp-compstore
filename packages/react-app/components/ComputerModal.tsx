import { Dialog, Transition } from "@headlessui/react";
import { useCelo } from "@celo/react-celo";
import { useState, FormEvent, Fragment } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { ComputerMarketplaceAbi, ComputerMarketplaceContract } from "@/context/constants";

export default function ComputerModal() {
 
  const { kit, address } = useCelo();

  let [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [specs, setSpecs] = useState<string>("");
  const [price, setPrice] = useState<string>("0");

  const router = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      
    const contract = new kit.connection.web3.eth.Contract(
          ComputerMarketplaceAbi as any,
          ComputerMarketplaceContract
     );

    //Define the transaction parameters
    const params = [
      title,
      imageUrl,
      specs,
      location,
      ethers.utils.parseEther(price),
     
    ];

    try {
        const tx = await contract.methods
          .writeProduct(...params)
          .send({ from: address });
      setTitle("");
      setImageUrl("");
      setLocation("");
      setSpecs("");
      setPrice("");
      alert(`🎉 You successfully added "${params[0]}".`);
      router.refresh();
    } catch (error) {
      alert(`⚠️ ${error}.`);
    }
  };

  return (
    <>
      <div className=" inset-0 flex items-center justify-start">
        <button
          type="button"
          onClick={openModal}
          className="cursor-pointer rounded-full border-2 border-gray-800 text-gray-800 px-3 py-2"
        >
          List a Computer
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
                    List a Computer
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      className="p-4"
                      data-theme="cupcake"
                      onSubmit={handleSubmit}
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2  ">
                          <div>
                            <label className="label">
                              <span className="label-text">Computer Title</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Computer Title"
                              name="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="input-bordered input rounded-md w-full max-w-xs"
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Image URL</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Image Url"
                              name="imageUrl"
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              className="input-bordered input rounded-md w-full max-w-xs"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2  ">
                          <div className="">
                            <label className="label">
                              <span className="label-text">Computer Specs</span>
                            </label>
                            <textarea
                              className="textarea-bordered rounded-md textarea h-24 w-full"
                              placeholder="Computer Specs"
                              name="specs"
                              value={specs}
                              onChange={(e) => setSpecs(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Store Location</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Store Location"
                              name="location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="input-bordered input rounded-md w-full max-w-xs"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 ">
                          <div>
                            <label className="label">
                              <span className="label-text">Price</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Price"
                              name="price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="input-bordered input rounded-md w-full max-w-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-end   ">
                          <div>
                            <button
                              type="submit"
                              className="btn-wide btn border-none bg-[#250438] text-white"
                            >
                              List Computer
                            </button>
                          </div>

                          <div className="mt-4">
                            <button
                              type="button"
                              className="btn inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-200"
                              onClick={closeModal}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
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
