import { getProducts } from "@/lib/actions/product.action";
import Image from "next/image";
import React from "react";
import { ActionButton } from "@/components/ActionButton";


interface ViewProductProps {
  productId: string;
}

const ViewProduct: React.FC<ViewProductProps> = async ({ productId }) => {
  let product: Product | null = null;

  try {
    product = await getProducts("viewProduct", productId);
  } catch (error: unknown) {
    console.error("Failed to fetch product:", (error as Error).message);
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400 text-lg">Product not found!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 px-6 lg:px-20 py-10 h-[100vh]">
      <Image
        src={product.image}
        alt="product"
        width={400}
        height={400}
        unoptimized
        className="rounded-lg shadow-md w-[50vw]"
      />
      <div className="w-full max-w-lg">
        <p className="text-2xl lg:text-3xl font-semibold text-gray-700 mb-4">
          {product.productName}
        </p>
        <p>{product.productDetails}</p>
        <p className="text-lg lg:text-xl text-gray-600 mb-6">
          Offer price:{" "}
          <span className="text-green-500 font-bold">{product.price}/-</span>{" "}
          <span className="text-gray-500">Regular price:</span>{" "}
          <span className="line-through text-gray-400">
            {(product.price * 1.5).toFixed(2)}
          </span>
        </p>
        {/* Action Button */}
        <ActionButton action="cart" />
      </div>
    </div>
  );
};

export default ViewProduct;
