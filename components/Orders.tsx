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

  const { orderedItems, orderDetails } = orderedProducts;

  if (!orderedItems?.length) return <p>No Orders</p>;

  return (
    <div>
      <h1 className="text-[1.5vw]">Ordered Products:</h1>
      <ul className="bordered p-4 my-2 sticky top-0 bg-white z-10">
        <li className="grid grid-cols-10 gap-4 font-semibold">
          <p className="col-span-2">Image</p>
          <p className="col-span-2">Name</p>
          <p className="col-span-3">Details</p>
          <p className="col-span-1">Price</p>
          <p className="col-span-1">Quantity</p>
          <p className="col-span-1">Status</p>
        </li>
      </ul>

      <ul className="overflow-y-scroll">
        {orderedItems.map((item, index) => {
          const order = orderDetails[index];
          return (
            <div key={item.$id}>
              <li className="grid grid-cols-10 gap-4 items-center mb-3">
                <Image
                  src={item.image}
                  alt="product"
                  width={100}
                  height={100}
                  unoptimized={true}
                  className="rounded-md col-span-2"
                />
                <p className="col-span-2">{item.productName}</p>
                <p className="col-span-3">{item.productDetails}</p>
                <p className="col-span-1">{item.price}</p>
                <p className="col-span-1">{order?.quantity || 1}</p>
                <p className="col-span-1 text-green-400 font-semibold">
                  {order?.orderStatus}
                </p>
              </li>
              <div className="flex justify-between w-[100%] lg:flex-row flex-col">
                <p>Ordered On: {formateDateTime(order?.orderDate)}</p>
                <p>
                  Delivered By:{" "}
                  <span className="text-green-400 font-bold">
                    {formateDateTime(order?.orderDate, 7)}
                  </span>
                </p>
              </div>
              <hr className="my-4" />
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;
