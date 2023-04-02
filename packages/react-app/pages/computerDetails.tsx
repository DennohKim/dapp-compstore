import Loader from "@/components/Loader";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { shortenAddress } from "@/utils/shortenAddress";
import { IoIosPin } from "react-icons/io";



export default function ComputerDetails() {

   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [computer, setComputer] = useState({
     image_url: "",
     computer_title: "",
     computer_specs: "",
     store_location: "",
     price: 0,
     owner: "",
    
   });

   const router = useRouter();

   useEffect(() => {
     if (!router.isReady) return;
     setComputer(router.query);
     console.log(router.query);

     setIsLoading(false);
   }, [router.isReady, router.query]);

    if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 px- gap-y-10 gap-x-6 sm:grid-cols-2  ">
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
        <p className="pb-2">
          Owner:{" "}
          <span className="font-semibold">
            {shortenAddress(computer.owner)}
          </span>
        </p>
        <div className="pb-2 flex items-center">
          <div className="flex items-center space-x-2">
            <IoIosPin /> <p>Store Location: </p>
          </div>
          <div className="font-semibold"> {computer.store_location}</div>
        </div>
        <h1 className="text-2xl font-bold pb-10">{computer.computer_title}</h1>
        <h2 className="text-xl font-semibold pb-4">Computer Specifications</h2>
        <div>
          {computer.computer_specs.split(",").map((specs: string) => {
            return <p key={specs}>&#8226; {specs.trim()}</p>;
          })}
        </div>
        <div className="pt-10">
          Buy for{" "}
          {computer.price
            ? ethers.utils.formatEther(computer.price) + " CELO"
            : "Loading..."}
        </div>
      </div>
    </div>
  );
}
