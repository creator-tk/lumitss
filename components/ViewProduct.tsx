import { getProducts } from '@/lib/actions/product.action';
import Image from 'next/image';
import React from 'react';
import { ActionButton } from './ActionButton';

interface ViewProductProps {
  productId: string;
}

interface ProductData {
  image: string;
  productName: string;
  productDetails: string;
  price: number;
}

interface ProductResponse {
  success: boolean;
  data: ProductData;
}

const ViewProduct: React.FC<ViewProductProps> = async ({ productId }) => {
  const product: ProductResponse = await getProducts('viewProduct', productId);

  const { success, data } = product;

  if (!success) {
    return <div className='flex-center h-full w-full text-gray-500 md:text-[1.5vw] text-xl'>Something went wrong! Please try again later...</div>;
  }

  return (
    <>
      {success && (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 px-6 lg:px-20 py-10 h-[100vh]">
          {/* Product Image */}
          <Image
            src={data?.image}
            alt="product"
            width={400}
            height={400}
            unoptimized
            className="rounded-lg shadow-md"
          />
          <div className="w-full max-w-lg">
            <p className="text-2xl lg:text-3xl font-semibold text-gray-700 mb-4">
              {data?.productName}
            </p>
            <p>{data?.productDetails}</p>
            <p className="text-lg lg:text-xl text-gray-600 mb-6">
              Offer price: <span className="text-green-500 font-bold">{data?.price}/-</span>{' '}
              <span className="text-gray-500">Regular price:</span>{' '}
              <span className="line-through text-gray-400">{(data?.price * 1.5).toFixed(2)}</span>
            </p>
            {/* Action Button */}
            <ActionButton action="cart" />
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProduct;
