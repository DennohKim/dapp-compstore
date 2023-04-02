import AddComputerModal from "@/components/AddComputerModal";
import { MarketplaceContext } from "@/context/marketplaceContext";
import { Computer } from "@/typings";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";




export default function Home() {

const [computers, setComputers] = useState([]);
const { getProducts } = useContext(MarketplaceContext);


useEffect(() => {
  getProducts().then((data: []) => {
    setComputers(data);
    console.log(data);
  });
}, [getProducts]);

  return (
    <div className="bg-white rounded-lg">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold pb-10">Products</h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {computers.map((computer: Computer) => (
            <Link
              href={{ pathname: "/computerDetails", query: computer }}
              key={computer.index}
            >
              <div className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
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
                  <h3 className="mt-4 text-sm text-gray-700">
                    {computer.computer_title.substring(0, 28)}...
                  </h3>
                </div>

                <p className="mt-1 font-medium text-gray-900">
                  {ethers.utils.formatEther(computer.price)} CELO
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
