"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getProducts } from "@/lib/actions/product.action";
import { ActionButton } from "@/components/ActionButton";
import { getCurrentUser } from "@/lib/actions/user.action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Loader2Icon, OctagonMinus, PlusCircleIcon } from "lucide-react";
import AddressPopUp from "./AddressPopUp";
import Loading from "./Loader";
import Payment from "./Payment";
import { initializePayment } from "@/lib/actions/payment.action";



interface Address {
  location: string | object;
}

const Cart: React.FC = () => {
  const [isOrderPopUpVisible, setOrderPopUpVisible] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [orderDetails, setOrderDetails] = useState({
    location: "",
    products: [],
    quantity: {},
    price: 0,
    orderId: ""
  })
  const [paymentPopuVisible, setPaymentPopUpVisible] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  const { toast } = useToast();

  const updateQuantity = (productId: string, updatedQuantity: number) => {
    setQuantity((prev) => ({ ...prev, [productId]: updatedQuantity }));
  };

  useEffect(() => {
    const getCartProducts = async () => {
      setPageLoading(true);
      try {
        const products = await getProducts("cart");

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

  const handleOrderClick = async (productId: string, price:number) => {
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

      try {
        const order = await initializePayment(price, "INR");
        setOrderDetails({
          location: typeof currentUserAddress?.location === 'string' ? currentUserAddress.location : address,
          products: [productId],
          quantity: { [productId]: quantity[productId] || 1 },
          price: price,
          orderId: order.id
        });
      } catch (error) {
        console.log("Error:", error.message);
        toast({
          title:"Something went wrong try after some time"
        })
      }

      if (!currentUserAddress) {
        setSelectedProductId(productId);
        setOrderPopUpVisible(true);
        return;
      }else{    
        setPaymentPopUpVisible(true);
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
    <>
      <div>
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        {pageLoading ? (
          <Loading/>
        ) : cartProducts.length > 0 ? (
          cartProducts.map((product) => (
            <div key={product.$id} className="mb-8">
              <div
                className="grid grid-cols-5 gap-2"
              >
                <Image
                  src={product.image}
                  alt="product"
                  width={200}
                  height={200}
                  unoptimized={true}
                  className="rounded-lg w-[100px] col-span-2 h-[100px]"
                />
                <div className="col-span-3">
                  <div>
                    <p className="text-sm font-bold">{product.productName}</p>
                    <p>Rs: {product.price}/- <span className="line-through text-gray-500">Rs{product.price*1.5}</span></p>
                  </div>
                  <div className="bordered flex p-2 !rounded-full justify-between w-[200px]">
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
                </div>
              </div>
              <div className="w-[100%] flex gap-2 my-2  ">
                <ActionButton
                  action="remove"
                  id={product.$id}
                  style="bg-transparent text-black border border-gray-500 hover:bg-black hover:text-white py-2 px-4 rounded !text-sm w-[150px]"
                />
                <Button
                  onClick={() => handleOrderClick(product.$id, product.price)}
                  disabled={actionLoading[product.$id]}
                  className={`bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded text-sm !w-[150px]${
                    actionLoading[product.$id] ? "cursor-not-allowed" : ""
                  }`}
                >
                  {actionLoading[product.$id] ? <Loader2Icon className="animate-spin text-white"/> : "Proceed to Buy"}
                </Button>
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
            popUpVisible={() => setPaymentPopUpVisible(true)} 
            paymentAddress={(addressString) => setAddress(addressString)} 
          />
        )}
      </div>

      {/**Payment Popup */}
      {paymentPopuVisible && (
        <Payment
          orderDetails={orderDetails}
          address={address || ""}
          close={()=>setPaymentPopUpVisible(false)}
        />
      )}
    </>
  );
};

export default Cart;
