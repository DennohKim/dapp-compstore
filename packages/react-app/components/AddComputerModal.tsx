import { MarketplaceContext } from "@/context/marketplaceContext";
import { useCelo } from "@celo/react-celo";
import { useState, useContext, FormEvent } from "react";
import { ethers } from "ethers";

export default function AddComputerModal() {
  const { address, kit } = useCelo();

  const { fetchContract } = useContext(MarketplaceContext);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [specs, setSpecs] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const provider = new ethers.providers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    );
    const contract = fetchContract(provider);

    const params = [title, imageUrl, location, specs, price];

    try {
      const result = await contract
        .writeProduct(...params)
        

      alert("Upload Successful ");
      setTitle("");
      setImageUrl("");
      setLocation("");
      setSpecs("");
      setPrice("");
    } catch (error) {
      alert(error);
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
      <div data-theme="cupcake" className="modal">
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
