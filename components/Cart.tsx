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

interface Product {
  $id: string;
  image: string;
  productName: string;
  productDetails: string;
  price: number;
}

const Cart: React.FC = () => {
  const [isOrderPopUpVisible, setOrderPopUpVisible] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  const route = useRouter();
  const { toast } = useToast();

  const updateQuantity = (productId: string, updatedQuantity: number) => {
    setQuantity(prev => ({ ...prev, [productId]: updatedQuantity }));
  };

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
        console.error("Failed to fetch cart products:", (error as Error).message);
      } finally {
        setPageLoading(false);
      }
    };
    getCartProducts();
  }, []);

  const handleOrderClick = async (productId: string) => {
    setActionLoading(prev => ({...prev, [productId]: true}));
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setActionLoading(prev => ({...prev, [productId]: false}));
        return;
      }

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
          quantity: quantity,
        });
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed successfully.",
          variant: "success",
        });

        route.push("/user/orders");
      }
    } catch (error) {
      console.log("Error handling order:", (error as Error).message);
      toast({
        title: "Failed to place order",
        description: (error as Error).message,
        variant: "error",
      });
    } finally {
      setActionLoading(prev => ({...prev, [productId]: false}));
    }
  };

  return (
    <div className="px-4 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {pageLoading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : cartProducts.length > 0 ? (
        cartProducts.map((product) => (
          <div
            key={product.$id}
            className="flex flex-col md:flex-row shadow-md p-4 gap-4 my-4 rounded-lg bg-white items-center md:items-start"
          >
            <Image
              src={product.image}
              alt="product"
              width={200}
              height={200}
              unoptimized={true}
              className="rounded-lg overflow-hidden w-full max-w-[200px] h-auto md:w-1/3 md:h-[200px]"
            />
            <div className="flex flex-col gap-4 w-full">
              <div>
                <p className="text-lg font-semibold md:text-xl">{product.productName}</p>
                <p className="text-gray-600 text-sm md:text-base">{product.productDetails}</p>
                <div className="flex flex-col md:flex-row gap-2 mt-2">
                  <p className="text-gray-800 font-semibold">
                    Offer Price: {product.price}/-
                  </p>
                  <p className="text-gray-500 text-sm md:text-base">
                    Regular Price:{" "}
                    <span className="line-through">{product.price * 1.5}</span>/-
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border border-gray-300 p-2 rounded-lg w-[60%] md:w-[30%]">
                <OctagonMinus
                  onClick={() => updateQuantity(product.$id, (quantity[product.$id] || 1) - 1)}
                  className="cursor-pointer text-gray-600 hover:text-red-600"
                />
                <p className="text-gray-800 font-medium">{quantity[product.$id] || 1}</p>
                <PlusCircleIcon
                  onClick={() => updateQuantity(product.$id, (quantity[product.$id] || 1) + 1)}
                  className="cursor-pointer text-gray-600 hover:text-green-600"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4">
                <ActionButton
                  action="remove"
                  id={product.$id}
                  style="bg-transparent text-black border border-gray-500 hover:bg-black hover:text-white py-2 px-4 rounded w-full md:w-auto"
                />
                <Button
                  onClick={() => handleOrderClick(product.$id)}
                  disabled={actionLoading[product.$id]}
                  className={`bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded w-full md:w-auto ${
                    actionLoading[product.$id] ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {actionLoading[product.$id] ? "Loading..." : "Order"}
                </Button>
              </div>
              <p>Note: Your ordered product price is less than 500rs/- 50rs Delivery charges may apply </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 text-2xl">No products in cart</p>
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
