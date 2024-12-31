import { Star } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const DisplayProducts = ({ products, from, to }: { products: Array<{ [key: string]}>, from: number, to: number }) => {


  if(!products || products?.length === 0){
    return <div className='flex-center h-fill'>
      <p className='text-gray-500 text-4xl'>No products found!</p>
    </div>
  }
  return (
    <div className="text-3xl mb-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {products.slice(from || 0, to || products.length).map(eachProduct => (
        <div key={eachProduct.$id || eachProduct.productName }
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <Link href={`/viewProduct?product=${eachProduct.$id}`}>
            <div className="relative group shadow-gray-400">
              <Image
                src={eachProduct.image}
                alt="Product"
                width={300}
                height={300}
                unoptimized={true}
                className="w-full lg:h-64 object-cover h-40 group-hover:opacity-80 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-sans">View Product</p>
              </div>
            </div>
          </Link>
          <div className="p-4">
            <p className="lg:text-lg font-semibold text-gray-800 hover:text-gray-600 truncate text-sm">
              {eachProduct.productName}
            </p>
            <p className="text-gray-700 mt-2 mb-4">
              <span className="lg:text-lg text-md">Rs: {eachProduct.price}/-</span> <span className="line-through text-sm">Rs: {eachProduct.price*1.5}</span>
            </p>
            <div className="flex gap-2">
              <Star/>
              <Star/>
              <Star/>
              <Star/>
              <Star/>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default React.memo(DisplayProducts);
