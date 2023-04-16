
import ComputerCard from "@/components/ComputerCard";
import { useMarketPlace } from "@/context/MarketPlaceContext";
import { Computer } from "@/typings";

export default function Home() {
  const { computers } = useMarketPlace();

  return (
    <div className="bg-white rounded-lg">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold pb-10">Products</h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {computers.map((computer: Computer) => (
            <ComputerCard computer={computer} key={computer.index} />
          ))}
        </div>
      </div>
    </div>
  );
}
