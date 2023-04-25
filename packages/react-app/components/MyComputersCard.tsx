import { Computer } from '@/typings';
import Image from 'next/image';
import { ethers } from "ethers";
import { IoIosPin } from 'react-icons/io';
import { useMarketPlace } from '@/context/MarketPlaceContext';

const MyComputersCard = (
    { computer, index }: { computer: Computer; index: number }
) => {
  const { deleteProduct } = useMarketPlace();

  return (
    <div className="group flex flex-col space-y-6">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          width={300}
          height={300}
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
      </div>
      <div className="">
        <button
          onClick={() => deleteProduct(index)}
          className="rounded-md mt-2 py-2 px-4 text-white bg-rose-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default MyComputersCard