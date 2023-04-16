import { ethers } from "ethers";
import { Computer } from "@/typings";
import Image from "next/image";
import { IoIosPin } from "react-icons/io";
import { shortenAddress } from "@/utils/shortenAddress";
import { BigNumber } from "ethers";
import { useContext } from "react";
import { useMarketPlace } from "@/context/MarketPlaceContext";

export default function DetailsModal({ computer }: { computer: Computer }) {
  const { handleClick } =useMarketPlace();

  const value = ethers.utils.formatEther(computer.sold);

  const etherNumber = parseFloat(value);

  //convert to whole number
  const itemsSold = Math.round(etherNumber * 1e18);

  return (
    <>
      <label
        htmlFor="my-modal-5"
        className="font-bold cursor-pointer text-gray-900"
      >
        {ethers.utils.formatEther(computer.price)} CELO
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="grid grid-cols-1 px- gap-y-10 gap-x-6 sm:grid-cols-2 ">
            <div className="group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
              <Image
                width={600}
                height={600}
                src={computer.image_url}
                alt="computer"
                className="object-center group-hover:opacity-75 object-cover transform transition-all h-full w-full hover:scale-110 "
              />
            </div>
            <div>
              <div className="flex space-x-3">
                <p className="pb-2">
                  Owner:{" "}
                  <span className="font-semibold">
                    {shortenAddress(computer.owner)}
                  </span>
                </p>
                <p className="pb-2">
                  Items Sold: <span className="font-semibold">{itemsSold}</span>
                </p>
              </div>

              <div className="pb-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <IoIosPin /> <p className="pr-2">Store Location: </p>
                </div>
                <div className="font-semibold"> {computer.store_location}</div>
              </div>
              <h1 className="text-2xl font-bold pb-10">
                {computer.computer_title}
              </h1>
              <h2 className="text-xl font-semibold pb-4">
                Computer Specifications
              </h2>
              <div>
                {computer.computer_specs.split(",").map((specs: string) => {
                  return <p key={specs}>&#8226; {specs.trim()}</p>;
                })}
              </div>
              <div className="pt-10">
                Price:{" "}
                {ethers.utils.formatEther(BigNumber.from(computer.price)) +
                  " CELO"}
              </div>
            </div>
          </div>
          <div className="modal-action flex items-center">
           

            <label htmlFor="my-modal-5" className="btn">
              close
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
