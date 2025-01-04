"use client";

import { getAllProducts } from '@/lib/actions/product.action';
import { CircleArrowUpIcon, CirclePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ProductHandler from './ProductsHandler';
import { Button } from './ui/button';
import { fetchUserDetails } from '@/lib/serverAction';
import Loading from './Loader';

const Admin_Products: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUserDetails();
        const result = await getAllProducts();
        setProducts(result);
        setProductCount(result.length)
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  const handleAddProductClick = (): void => {
    setCurrentProduct(null);
    setShowAddProduct(true);
  };

  const handleUpdateProductClick = (product: Product): void => {
    setCurrentProduct(product);
    setShowAddProduct(true);
  };

  return (
    <div>
      <p className='text-[2vw]'>total Products: {productCount}</p>
      <div className="flex justify-end">
        <Button
          onClick={handleAddProductClick}
          className="flex items-center gap-2 rounded-full md:!p-4 shadow-2xl text-[1vw] !p-0 !m-0 bg-transparent md:bg-black"
        >
          <p className='hidden md:block'>Add product</p>
          <CirclePlus className='text-black md:text-white '  />
        </Button>
      </div>

      <div className="mt-4">
        <ul className="grid grid-cols-11 gap-2 bordered items-center p-2">
          <li className="col-span-2 text-[1.2vw]">Image</li>
          <li className="col-span-2 text-[1.2vw]">Name</li>
          <li className="col-span-1 text-[1.2vw]">Price</li>
          <li className="col-span-3 text-[1.2vw]">Description</li>
          <li className="col-span-2 text-[1.2vw]">Category</li>
          <li className="col-span-1 text-[1.2vw]">Update</li>
        </ul>

        {loading && <Loading/>}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-300">No products found!</p>
        )}
        {!loading &&
          products.map((product) => (
            <ul
              key={product.$id}
              className="grid grid-cols-11 gap-2 items-center p-2"
            >
              <li className="col-span-2 text-[1vw] truncate">
                <Image
                  src={product.image}
                  alt="product"
                  width={100}
                  height={100}
                  unoptimized
                />
              </li>
              <li className="col-span-2 text-[1vw]">{product.productName}</li>
              <li className="col-span-1 text-[1vw]">{product.price}</li>
              <li className="col-span-3 text-[1vw]">{product.productDetails}</li>
              <li className="col-span-2 text-[1vw]">{product.category}</li>
              <li className="col-span-1 text-[1vw]">
              <CircleArrowUpIcon onClick={() => handleUpdateProductClick(product)} className='!w-[2.5vw]'/>
              </li>
            </ul>
          ))}
      </div>

      <ProductHandler
        Open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        field={currentProduct ? 'Update' : 'Add'}
        productId={currentProduct?.$id || ''}
        setCount={setProductCount}
        productData={currentProduct}
      />
    </div>
  );
};

export default Admin_Products;
