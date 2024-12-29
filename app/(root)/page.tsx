import { getProducts } from "@/lib/actions/product.action";
import React from "react";
import Image from "next/image";
import { ActionButton } from "@/components/ActionButton";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts("all", "");

  return (
    <main className="mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((eachProduct) => (
          <div
            key={eachProduct.$id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/viewProduct?product=${eachProduct.$id}`}>
              <div className="relative group">
                <Image
                  src={eachProduct.image}
                  alt="Product"
                  width={300}
                  height={300}
                  unoptimized={true}
                  className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg">View Product</p>
                </div>
              </div>
            </Link>
            <div className="p-4">
              <p className="text-lg font-semibold text-gray-800 hover:text-gray-600 truncate">
                {eachProduct.productName}
              </p>
              <p className="text-gray-700 mt-2 mb-4">
                <b>Price:</b> {eachProduct.price}/-
              </p>
              <ActionButton action="cart" id={eachProduct.$id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}