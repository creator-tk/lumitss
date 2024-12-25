"use client";

import { getAllProducts } from '@/lib/actions/product.action';
import { CircleArrowUpIcon, CirclePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AddProduct from './AddProduct';
import { Button } from './ui/button';
import { fetchUserDetails } from '@/lib/serverAction';

const Admin_Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [addField, setAddField] = useState(false);
  const [fieldName, setFieldName] = useState('Add');
  const [productId, setProductId] = useState('');


  const productState = (prop) => {
    setAddField(true);
    setFieldName(prop);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserDetails()
      const result = await getAllProducts();
      setProducts(result);
      setLoading(false);
    };

    fetchData();
  }, [fieldName]);

  const addProductToList = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setAddField(false); 
  };

  return (
    <div>
      <div className='flex justify-end'>
        <Button onClick={() => productState("Add")} className='flex items-center gap-2 rounded-full p-4 shadow-2xl'>
          Add Products
          <CirclePlus />
        </Button>
      </div>

      <div className='mt-4'>
        <ul className='grid grid-cols-11 gap-2 bordered items-center p-2'>
          <li className='col-span-2'>Image</li>
          <li className='col-span-2'>Name</li>
          <li className='col-span-1'>Price</li>
          <li className='col-span-3'>Description</li>
          <li className='col-span-2'>Category</li>
          <li className='col-span-1'>
            Update
          </li>
        </ul>

        {loading && <p>Loading...</p>}
        {!loading && products.length === 0 && (
          <p className='text-center text-gray-300'>No products found!</p>
        )}
        {!loading && products.length > 0 && (
          products.map(product => (
            <ul key={product.$id} className='grid grid-cols-11 gap-2  items-center p-2'>
              <li className='col-span-2 truncate'>
                <Image
                  src={product.image}
                  alt="product"
                  width={100}
                  height={100}
                  unoptimized={true}
                />
              </li>
              <li className='col-span-2'>{product.productName}</li>
              <li className='col-span-1'>{product.price}</li>
              <li className='col-span-3'>{product.productDetails}</li>
              <li className='col-span-2'>{product.category}</li>
              <li className='col-span-1'>
                <Button onClick={() => {
                  productState("Update"); setProductId(product.$id);
                }}>
                  <CircleArrowUpIcon />
                </Button>
              </li>
            </ul>
          ))
        )}
      </div>

      <AddProduct Open={addField} onClose={() => setAddField(!addField)} field={fieldName} productId={productId} onAddProduct={addProductToList} />
    </div>
  );
};

export default Admin_Products;
