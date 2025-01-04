import React from "react";
import { getProducts } from "@/lib/actions/product.action";
import Image from "next/image";
import { formateDateTime } from "@/lib/utils";

type Product = {
  $id: string;
  image: string;
  productName: string;
  productDetails: string;
  price: number;
};

type OrderDetails = {
  quantity?: number;
  orderStatus: string;
  orderDate: string;
};

type OrderedProducts = {
  orderedItems: Product[];
  orderDetails: OrderDetails[];
};

const Orders = async () => {
  const orderedProducts: OrderedProducts | null = await getProducts("orders");
  
  if (!orderedProducts) return <p>No Orders yet</p>;

  if (!orderedProducts?.length) return <p>No Orders</p>;

  return (
    <div>
      <h1 className="text-3xl">Orders</h1>
      <div className="md:grid grid-cols-4 px-4 hidden">
        <p className="col-span-2">PRODUCT</p>
        <p className="col-span-1">QUANTITY</p>
        <p className="col-span-1">TOTAL</p>
      </div>

      <div className="overflow-y-scroll px-4">
        {orderedProducts.map((item, index) => {
          return (
            <div key={index} className="mb-12 mt-2">
              <div className="grid grid-cols-4 gap-4">
                <div className="flex gap-2 md:col-span-2 col-span-4">
                  <Image
                    src={item?.productDetails?.image}
                    alt="product"
                    width={100}
                    height={100}
                    unoptimized={true}
                    className="rounded-md"
                  /> 
                  <div>
                    <p className=" font-bold">{item?.productDetails?.productName}</p>
                    <div className="md:hidden">
                      <p className="col-span-1">
                        quantity: {item?.quantity || 1}
                      </p>
                      <p className="col-span-1">Rs: {(item?.quantity)*(item?.productDetails?.price)}/-</p>
                    </div>
                    <p className=" text-green-400 font-semibold">
                      Status: {item?.orderStatus}
                    </p>
                  </div>
                </div>
                <p className="col-span-1 md:block hidden">
                  quantity: {item?.quantity || 1}
                </p>
                <p className="col-span-1 md:block hidden">Rs: {(item?.quantity)*(item?.productDetails?.price)}/-</p>
              </div>
              <div className="flex justify-between w-[100%] ">
                <p>Ordered On: {formateDateTime(item?.orderDate)}</p>
                <p>
                  Delivered By:{" "}
                  <span className="text-green-400 font-bold">
                    {formateDateTime(item?.orderDate, 7)}
                  </span>
                </p>
              </div>
              <hr className="my-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
