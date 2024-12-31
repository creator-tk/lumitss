"use client";

import { getProducts } from '@/lib/actions/product.action';
import React, {useEffect, useState } from 'react';
import DisplayProducts from './DisplayProducts';
import { useToast } from '@/hooks/use-toast';
import Loading from './Loader';

const SearchResults = ({ query }) => {
  const { toast } = useToast();

  const [searchedProducts, setSearchedProducts] = useState([]);

  const [searchRelatedProducts, setSearchRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { searchResults, relatedProducts } = await getProducts("search", query);
        setSearchedProducts(searchResults);
        setSearchRelatedProducts(relatedProducts)
      } catch (error) {
        toast({
          title: "Something went wrong. Please try again later.",
        });
        console.log(error.message);
      } finally{
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, toast]);

  return (
    <div className="mb-8">
      <h1 className="mt-4 mb-8">Search Results :</h1>
      {!loading ? (
        <DisplayProducts products={searchedProducts} />
      ): <Loading/>}

      <hr className='my-12'/>
      {searchRelatedProducts.length > 0 && (
        <>
          <p className='mb-6'>Related Products</p>
          <DisplayProducts products={searchRelatedProducts} to={4}/>
        </>
      )}

    </div>
  );
};

export default SearchResults;
