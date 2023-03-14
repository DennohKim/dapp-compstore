import AddComputerModal from "@/components/AddComputerModal";
import { MarketplaceContext } from "@/context/marketplaceContext";
import { Computer } from "@/typings";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";



const products = [
  {
    id: 1,
    name: "HP 348 G4 – 7TH GENERATION - 14-INCH LAPTOP - 2.7 GHZ PROCESSOR - INTEL CORE I5 - 8GB RAM - 500GB HARD DISK",
    href: "#",
    price: "45 CELO - $48",
    imageSrc:
      "https://d3959dyu54wgqd.cloudfront.net/images/watermarked/1/thumbnails/400/350/detailed/10/81BuyrZ22WL._SL1500_.jpg?t=1674290445",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 2,
    name: "HP ELITEBOOK 840 G3 - 14 - CORE I5-6600U 2.6GHZ, 16GB RAM, 256GB , WEBCAM, USB-C BLUETOOTH 4.2, WEBCAM",
    href: "#",
    price: "45 CELO - $35",
    imageSrc:
      "https://d3959dyu54wgqd.cloudfront.net/images/watermarked/1/thumbnails/400/350/detailed/12/225456_prev_ui.png?t=1674283570",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 3,
    name: "HP 15-DW1345NIA INTEL CORE I7-10510U 8GB RAM 1TB HDD WIN 11 15.6 INCH SCREEN TOUCH SCREEN",
    href: "#",
    price: "45 CELO - $89",
    imageSrc:
      "https://d3959dyu54wgqd.cloudfront.net/images/watermarked/1/thumbnails/400/350/detailed/12/HP-Laptop-15-DW1345NIA-Intel-Core-i7-10510U-8GB-Ram-1TB-Hdd-15.6inch-screen-Back_Devices-Technology.jpg?t=1675156666",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 4,
    name: "HP ENVY X360 13-BF0013DX 12TH GEN INTEL CORE I7-1250U 8GB RAM 512GB SSD 13.3 WUXGA TOUCHSCREEN",
    href: "#",
    price: "45 CELO - $35",
    imageSrc:
      "https://d3959dyu54wgqd.cloudfront.net/images/watermarked/1/thumbnails/400/350/detailed/12/26221669817765.jpeg?t=1675158309",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  // More products...
];


export default function Home() {

const [computers, setComputers] = useState([]);
const { getProducts } = useContext(MarketplaceContext);


useEffect(() => {
  getProducts().then((data: []) => {
    setComputers(data);
    console.log(data);
  });
}, []);

  return (
    <div className="bg-white rounded-lg">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold pb-10">Products</h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {computers.map((computer: Computer) => (
            <div key={computer.index} className="group">
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

              <p className="mt-1 text-lg font-medium text-gray-900">
                {/* {computer.price} */}
              </p>

              <button className=" border-2  rounded-full mt-4 px-8 py-3">
                Buy for {ethers.utils.formatEther(computer.price)} CELO
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
