import { Computer } from '@/typings';
import Image from 'next/image';
import React from 'react'
import { IoIosPin } from 'react-icons/io';
import CheckoutModal from './CheckoutModal';

const ComputerCard = ({computer}: {computer: Computer}) => {
  return (
    <div className="group flex flex-col space-y-6" >
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
        <h3 className="mt-4 text-md text-start font-semibold text-gray-700">
          {computer.computer_title.substring(0, 30)}...
        </h3>
        <div className="pt-2 flex items-center">
          <div className="pr-2">
            <IoIosPin />
          </div>
          <div className="font-normal"> {computer.store_location}</div>
        </div>
      </div>
      <div>
        <CheckoutModal computer={computer} />
      </div>
    </div>
  );
}

export default ComputerCard