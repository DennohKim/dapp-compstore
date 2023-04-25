import MyComputersCard from '@/components/MyComputersCard';
import { useMarketPlace } from '@/context/MarketPlaceContext';
import { Computer } from '@/typings';

const Mycomputers = () => {
    const { myProducts } = useMarketPlace();


  return (
    <div className="bg-white rounded-lg">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold pb-10">My Computers</h2>

        <div className="">
         
          {myProducts?.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {myProducts?.map((computer: Computer, index: number) => (
                <MyComputersCard
                  computer={computer}
                  key={index}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mycomputers