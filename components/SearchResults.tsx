import { getProducts } from '@/lib/actions/product.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ActionButton } from './ActionButton'

const SearchResults = async ({query}) => {
  const {searchResults, relatedProducts} = await getProducts("search", query);

  const resultedProducts = searchResults.length > 0 || relatedProducts.length > 0;

  return (
    <div className='px-20 py-2'>
      <h1 className='md:text-[1.5vw] text-[2vw]'>Search Results :</h1>
      <div className='flex'>
        {resultedProducts ? (
          searchResults.length > 0 ? searchResults : relatedProducts).map(eachProduct => (
            <div key={eachProduct.$id} className='flex gap-8 shadow-gray-400 shadow-lg rounded-lg p-4 items-center flex-shrink-0'>
              <div>
                <Link href={`/viewProduct?product=${eachProduct.$id}`}>
                  <Image
                    src={eachProduct.image}
                    alt='Image'
                    width={200}
                    height={200}
                    unoptimized={true}
                    className='rounded-full'
                  />
                </Link>
              </div>

              <div className='flex flex-col gap-1'>
                <p className='font-bold'>{eachProduct.productName}</p>
                <p>{eachProduct.productDetails}</p>
                <p> Offer price:{eachProduct.price}</p>
                <p> Regular price:<span className='line-through'>
                  {eachProduct.price * 1.5}
                  </span></p>
                
                <ActionButton action="cart"/>
              </div>
            </div>
          ))
            : <div className='w-fill h-[80vh] flex-center'>
            <p className='text-gray-600 text-[4vw]'>No Results Found!</p>
          </div>}
      </div>
    </div>
  )
}

export default SearchResults