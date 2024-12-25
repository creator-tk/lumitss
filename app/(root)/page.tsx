import { getAllProducts } from "@/lib/actions/product.action";
import React from "react";
import Image from "next/image";
import { ActionButton } from "@/components/ActionButton";

export default async function Home() {

  const products = await getAllProducts();

  return (
    <main className="lg:px-20 lg:my-9 flex gap-4 lg:flex-row flex-col">
      {products.map(eachProduct => (
        <ul key={eachProduct.$id} className="lg:shadow-2xl rounded-xl p-2 cursor-pointer w-fit-content flex lg:flex-col gap-6">
          <li>
            <Image
              src={eachProduct.image}
              alt="Product"
              width={250}
              height={100}
              unoptimized={true}
              className="rounded-xl lg:w-[250px] lg:h-[250px] w-[100px] h-[100px]"
            />
          </li>

          <li className="p-3 w-[60%] lg:w-[100%]">
            <p>{eachProduct.productDetails}</p>
            <p><b>Price:</b>{eachProduct.price}/-</p>
            <ActionButton action="cart" id={eachProduct.$id} />
          </li>
        </ul>
      ))}
    </main>
  );
}
