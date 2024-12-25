"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getProducts } from "@/lib/actions/product.action";
import { ActionButton } from "@/components/ActionButton";
import OrderPopUp from "./AddressPopUp";
import { placeOrder } from "@/lib/actions/product.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { OctagonMinus, PlusCircleIcon } from "lucide-react";


const Cart = () => {
  const [isOrderPopUpVisible, setOrderPopUpVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [quantity, setQuantity] = useState({})
  const [actionLoading, setActionLoading] = useState({})
  
  const route = useRouter();
  const { toast } = useToast();

  const updateQuantity = (productId, updatedQuantity) => {
    setQuantity(prev => ({ ...prev, [productId]: updatedQuantity }));
  }

  useEffect(() => {
    const getCartProducts = async () => {
      setPageLoading(true);
      try {
        const cartProducts = await getProducts("cart");
        console.log("Fetched Cart Products:", cartProducts);

        if (cartProducts.length === 0) {
          setPageLoading(false);
          setCartProducts([]);
          return;
        }

        setCartProducts(cartProducts);
      } catch (error) {
        console.error("Failed to fetch cart products:", error.message);
      } finally {
        setPageLoading(false);
      }
    };
    getCartProducts();
  }, []);

  const handleOrderClick = async (productId) => {
    setActionLoading(prev => ({...prev, [productId]:true}));
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser){
        setActionLoading(prev => ({...prev, [productId]:false}))
      };

      let currentUserAddress;
      if (currentUser.address !== "") {
        currentUserAddress = JSON.parse(currentUser.address);
      }

      if (currentUser.address === "") {
        setSelectedProductId(productId);
        setOrderPopUpVisible(true);
        return;
      } else {
        await placeOrder({
          location: currentUserAddress.location,
          products: [productId],
          quantity: quantity[productId],
        });
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed successfully.",
          variant: "success",
        });

        route.push("/user/orders");
      }
    } catch (error) {
      console.log("Error handling order:", error.message);
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "error",
      });
    } finally {
      setActionLoading(prev => ({...prev, [productId]:false}))
    }
  };

  return (
    <div className="px-4 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {pageLoading ? (
        <p>Loading...</p>
      ) : cartProducts.length > 0 ? (
        cartProducts.map((product) => (
          <div
            key={product.$id}
            className="flex flex-col lg:flex-row shadow-md p-4 gap-4 my-4 rounded-lg bg-white lg:items-center items-start"
          >
            <Image
              src={product.image}
              alt="product"
              width={200}
              height={200}
              unoptimized={true}
              className="rounded-lg overflow-hidden w-full max-w-[200px] h-auto lg:w-[200px] lg:h-[200px] mx-auto lg:mx-0"
            />
            <div className="flex flex-col gap-3 lg:gap-2 py-2 lg:py-3 w-full lg:w-auto">
              <div>
                <p className="text-lg lg:text-[1.5vw] font-medium text-gray-700">
                  {product.productDetails}
                </p>
                <div className="flex flex-col lg:flex-row lg:gap-4 mt-2">
                  <p className="text-gray-800 font-semibold">
                    Offer Price: {product.price}/-
                  </p>
                  <p className="text-gray-500">
                    Regular Price:{" "}
                    <span className="line-through">
                      {product.price * 1.5}
                    </span>
                    /-
                  </p>
                </div>
              </div>
              <div className="bordered w-1/2 flex justify-between p-2 !rounded-full">
                <OctagonMinus
                  onClick={()=> updateQuantity(product.$id, (quantity[product.$id] || 1) - 1 ) }
                />
                <p>{quantity[product.$id] || 1}</p>
                <PlusCircleIcon
                  onClick={() => {
                    updateQuantity(product.$id, (quantity[product.$id] || 1) + 1);
                  }}
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-2">
                <ActionButton
                  action="remove"
                  id={product.$id}
                  style="bg-transparent text-black border border-gray-500 hover:bg-black hover:text-white py-2 px-4 rounded"
                  className="w-full lg:w-auto"
                />
                <Button
                  onClick={() => handleOrderClick(product.$id)}
                  disabled={actionLoading[product.$id]}
                  className={`bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded lg:w-[100%] ${
                    actionLoading[product.$id] ? "cursor-not-allowed" : ""
                  }`}
                >
                  {actionLoading[product.$id] ? "Loading..." : "Order"}
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 text-[2.5vw]">No products in cart</p>
      )}

      {isOrderPopUpVisible && (
        <OrderPopUp
          isOpen={isOrderPopUpVisible}
          onClose={() => setOrderPopUpVisible(false)}
          productId={selectedProductId}
          quantity={quantity[selectedProductId]}
        />
      )}
    </div>
  );
};

export default Cart;
