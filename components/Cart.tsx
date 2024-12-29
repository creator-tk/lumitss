"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getProducts, placeOrder } from "@/lib/actions/product.action";
import { ActionButton } from "@/components/ActionButton";
import { getCurrentUser } from "@/lib/actions/user.action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Loader2Icon, OctagonMinus, PlusCircleIcon } from "lucide-react";
import AddressPopUp from "./AddressPopUp";
import Loading from "./Loader";


interface Address {
  location: string;
}

const Cart: React.FC = () => {
  const [isOrderPopUpVisible, setOrderPopUpVisible] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const { toast } = useToast();

  const updateQuantity = (productId: string, updatedQuantity: number) => {
    setQuantity((prev) => ({ ...prev, [productId]: updatedQuantity }));
  };

  useEffect(() => {
    const getCartProducts = async () => {
      setPageLoading(true);
      try {
        const products = await getProducts("cart");
        console.log("Fetched Cart Products:", products);

        if (!products || products.length === 0) {
          setCartProducts([]);
          return;
        }

        setCartProducts(products);
      } catch (error: unknown) {
        console.error("Failed to fetch cart products:", (error as Error).message);
      } finally {
        setPageLoading(false);
      }
    };

    getCartProducts();
  }, []);

  const handleOrderClick = async (productId: string) => {
    setActionLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("User not logged in.");
      }

      let currentUserAddress: Address | undefined;
      if (currentUser.address) {
        currentUserAddress = JSON.parse(currentUser.address) as Address;
      }

      if (!currentUserAddress) {
        setSelectedProductId(productId);
        setOrderPopUpVisible(true);
        return;
      } else {
        await placeOrder({
          location: currentUserAddress.location,
          products: [productId],
          quantity: { [productId]: quantity[productId] || 1 },
        });

        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed successfully.",
        });

        router.push("/user/orders");
      }
    } catch (error: unknown) {
      console.error("Error handling order:", (error as Error).message);
      toast({
        title: "Failed to place order",
        description: (error as Error).message,

      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="px-4 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {pageLoading ? (
        <Loading/>
      ) : cartProducts.length > 0 ? (
        cartProducts.map((product) => (
          <div
            key={product.$id}
            className="flex flex-col sm:flex-row shadow-md p-4 gap-8 my-4 rounded-lg bg-white md:items-center items-start"
          >
            <Image
              src={product.image}
              alt="product"
              width={200}
              height={200}
              unoptimized={true}
              className="rounded-lg sm:w-1/4 w-[100%]"
            />
            <div className="flex flex-col gap-3 md:gap-2 py-2 md:py-3 w-full md:w-auto">
              <div>
                <p className="text-xl md:text-[2vw]">{product.productName}</p>
                <p className="text-md md:text-[1vw]  text-gray-700">
                  {product.productDetails}
                </p>
                <div className="flex flex-col md:flex-row md:gap-4 mt-2">
                  <p className="text-gray-800 font-semibold">
                    Offer Price: {product.price}/-
                  </p>
                  <p className="text-gray-500">
                    Regular Price: {" "}
                    <span className="line-through">
                      {product.price * 1.5}
                    </span>
                    /-
                  </p>
                </div>
              </div>
              <div className="bordered sm:w-1/4 flex justify-between p-2 !rounded-full 
              !w-[50%]">
                <OctagonMinus
                  onClick={() =>
                    updateQuantity(product.$id, (quantity[product.$id] || 1) - 1)
                  }
                  className="cursor-pointer"
                />
                <p>{quantity[product.$id] || 1}</p>
                <PlusCircleIcon
                  onClick={() => {
                    updateQuantity(product.$id, (quantity[product.$id] || 1) + 1);
                  }}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2 sm:w-1/2">
                <ActionButton
                  action="remove"
                  id={product.$id}
                  style="bg-transparent text-black border border-gray-500 hover:bg-black hover:text-white py-2 px-4 rounded"
                />
                <Button
                  onClick={() => handleOrderClick(product.$id)}
                  disabled={actionLoading[product.$id]}
                  className={`bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded md:w-[100%] ${
                    actionLoading[product.$id] ? "cursor-not-allowed" : ""
                  }`}
                >
                  {actionLoading[product.$id] ? <Loader2Icon className="animate-spin text-white"/> : "Order"}
                </Button>
              </div>
              <p>Note: Your product costs less than 500rs/-. Delivery charges may apply 50/-</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 text-[2.5vw]">No products in cart</p>
      )}

      {isOrderPopUpVisible && selectedProductId && (
        <AddressPopUp
          isOpen={isOrderPopUpVisible}
          onClose={() => setOrderPopUpVisible(false)}
          productId={selectedProductId}
          quantity={{ [selectedProductId]: quantity[selectedProductId] || 1 }}
        />
      )}
    </div>
  );
};

export default Cart;
