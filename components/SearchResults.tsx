import { getProducts } from '@/lib/actions/product.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ActionButton } from './ActionButton'

const SearchResults = async ({query}) => {
  const {searchResults, relatedProducts} = await getProducts("search", query);

  const resultedProducts = searchResults.length > 0 || relatedProducts.length > 0;

  return (
    <div className='md:px-20 py-2 px-10'>
      <h1 className=' text-[3.5vh] md:text-2xl'>Search Results :</h1>
      <div>
        {resultedProducts ? (
          searchResults.length > 0 ? searchResults : relatedProducts).map(eachProduct => (
            <div key={eachProduct.$id} className='flex gap-8 shadow-gray-400 shadow-lg rounded-lg p-4 flex-shrink-0 flex-col sm:flex-row'>
              <div className='sm:w-1/2 w-[100%]'>
                <Link href={`/viewProduct?product=${eachProduct.$id}`}>
                  <Image
                    src={eachProduct.image}
                    alt='Image'
                    width={200}
                    height={200}
                    unoptimized={true}
                    className='w-[100%] rounded-xl'
                  />
                </Link>
              </div>

              <div className='flex flex-col gap-1'>
                <p className='font-bold sm:text-[3vw] text-2xl'>{eachProduct.productName}</p>
                <p className='text-[2vw]md:text-sm'>{eachProduct.productDetails}</p>
                <p> Offer price:{eachProduct.price}/-</p>
                <p> Regular price:<span className='line-through'>
                  {eachProduct.price * 1.5}/-
                  </span></p>
                
                <ActionButton style='w-fit' action="cart"/>
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