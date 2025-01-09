"use client"

import { getProducts } from '@/lib/actions/product.action'
import React, { useEffect, useState } from 'react'
import Loading from './Loader';
import DisplayProducts from './DisplayProducts';
import { StepBack, StepForward } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const Collections = ({category}) => {
  const [resultedProducts, setResultedProducts] = useState([]);

  const [productsCount, setProductsCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [prevCount, setPrevCount] = useState(0)
  const [pageLimit, setPageLimit] = useState(12)
  const {toast} = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        if (category === "") {
          const allProducts = await getProducts("all", "");
          setResultedProducts(allProducts);
        } else {
          const { total, documents } = await getProducts("collections", category);
          setResultedProducts(documents || []);
          setProductsCount(total || 0);
        }
      } catch (error) {
        toast({
          title: "Something went wrong, please try again later.",
        });
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchData();
  }, [category, toast]);
  

  const clickHandler = (action) => {
    if (action === 'forward') {
      console.log("from forward Action area", "pageLimig:", pageLimit, "prevCount:",prevCount, "resultedProducts length:",resultedProducts.length)
      setPrevCount((prev) => prev + pageLimit);
      setPageLimit((prevLimit) => resultedProducts.length > prevLimit ? prevLimit+12 : prevLimit+0);
    } else if (action === 'backward') {
      console.log("from backward Action area", "pageLimig:", pageLimit, "prevCount:",prevCount, "resultedProducts length:",resultedProducts.length)
      if (prevCount > 0) {
        setPrevCount((prev) => Math.max(prev - pageLimit, 0));
        setPageLimit((prevLimit) => Math.max(prevLimit - 12, 12)); 
      }
    }
  };
  
  return (
    <>
      <div className='min-h-60'>
        <div className='flex justify-between my-6'>
          <p className='md:text-3xl underline'>{category === "kitchen" ? "Home & kitchen" : category === "gift"? "Gift's": category === "desktop" ? "Desktop Decor Items" : category === "unique" ? "Some Unique products for you": "Products"}</p>

          {category !== "" && (
            <p>Total: {productsCount}</p>
          )}

        </div>

        {loading ? (
          <Loading/>
        ): (
          <DisplayProducts products={resultedProducts} from={prevCount} to={pageLimit}/>
        )}
      </div>

      <div className='flex md:justify-end justify-center'>
        <div className='flex gap-2'>
          <Button className='flex cursor-pointer' 
            onClick={() => clickHandler('backward')} 
            disabled={prevCount <= 0}>
            <StepBack />Prev
          </Button>

          <Button className='flex flex-row-reverse cursor-pointer' 
            onClick={() => clickHandler('forward')}
            disabled={prevCount + pageLimit >= resultedProducts.length}>
              <StepForward/>Next
          </Button>
        </div>
      </div>
    </>

  )
}

export default Collections