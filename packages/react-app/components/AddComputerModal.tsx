import { MarketplaceContext } from "@/context/marketplaceContext";
import { useCelo } from "@celo/react-celo";
import { useState, useContext, FormEvent } from "react";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { CustomWindow } from "@/typings";


export default function AddComputerModal() {
  

  const { fetchContract, getProducts } = useContext(MarketplaceContext);

  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [specs, setSpecs] = useState<string>("");
  const [price, setPrice] = useState<string>("0");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // creates a new instance of the Web3Provider 
    const provider = new ethers.providers.Web3Provider(
      (window as CustomWindow).ethereum
    );
    await provider.send("eth_requestAccounts", []);

    // Create a signer using the provider
    const signer = provider.getSigner();

    // Fetch the contract instance
    const contract = fetchContract(provider);

    // Connect the signer to the contract
    const contractWithSigner = contract.connect(signer);
    const account = await signer.getAddress();

    //Define the transaction parameters
    const params = [
      title,
      imageUrl,
      specs,
      location,
      ethers.utils.parseEther(price),
    ];

    try {
      const tx = await contractWithSigner.writeProduct(...params);
      await tx.wait();
      setTitle("");
      setImageUrl("");
      setLocation("");
      setSpecs("");
      setPrice("0");
      alert(`🎉 You successfully added "${params[0]}".`);
      await getProducts();
    } catch (error) {
      alert(`⚠️ ${error}.`);
    }
  };

  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="my-modal-3"
        className="cursor-pointer rounded-full border-2 border-gray-800 text-gray-800 px-3 py-2"
      >
        List a Computer
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div data-theme="cupcake" className="modal bg-gray-500/50 h-full">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <form onSubmit={handleSubmit}>
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
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 ">
                <div>
                  <label className="label">
                    <span className="label-text">Store Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-bordered input rounded-md w-full max-w-xs"
                  />
                </div>
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
              <div className="grid grid-cols-1 items-end gap-6  ">
                <div>
                  <button
                    type="submit"
                    className="btn-wide btn border-none bg-[#250438] text-white"
                  >
                    List Computer
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
