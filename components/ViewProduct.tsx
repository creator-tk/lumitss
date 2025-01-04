import { getProducts } from "@/lib/actions/product.action";
import Image from "next/image";
import React from "react";
import { ActionButton } from "@/components/ActionButton";
import { Star } from "lucide-react";
import CountdownTimer from "./Counter";
import DisplayProducts from "./DisplayProducts";


interface ViewProductProps {
  productId: string;
}

const ViewProduct: React.FC<ViewProductProps> = async ({ productId }) => {
  let product: Product | null = null;
  let relatedProducts: Product | null = null; 

  try {
    product = await getProducts("viewProduct", productId);
    relatedProducts = await getProducts("all")
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
    <>
      <div className="my-12 grid md:grid-cols-2 grid-cols-1 gap-8">
        <Image
          src={product.image}
          alt="product"
          width={400}
          height={400}
          unoptimized
          className="rounded-lg shadow-md w-[600px] sticky top-4"
        />
        <div className="w-full max-w-lg overflow-visible">
          <p className="font-bold text-5xl leading-snug">
            {product.productName}
          </p>
          <p className="text-lg lg:text-xl text-gray-600 mb-6">
            Rs:{" "}
            <span className="text-xl">{product.price}/-</span>{" "}
            <span className="text-gray-500"> Rs:</span>{" "}
            <span className="line-through text-gray-400">
              {(product.price * 1.5).toFixed(2)}
            </span>
          </p>
          <div className="flex gap-2 mb-4">
            <Star className="fill-black"/>
            <Star className="fill-black"/>
            <Star className="fill-black"/>
            <Star className="fill-black"/>
            <Star className="fill-black"/>
          </div>
          {/* Action Button */}
          <ActionButton action="cart" id={product?.$id} />

          <div className="!border-red-500 rounded-xl bordered my-12 h-[200px] p-8">
            <h1 className="mb-4 text-center font-mono text-3xl ">LIMITED TIME SALE</h1>
            <CountdownTimer/>
          </div>
        </div>
      </div>

      <hr className="my-12"/>
      <h1 className="text-xl my-4">Products You might like:</h1>

      <DisplayProducts products={relatedProducts} from={Math.round(Math.random()*4)} to={Math.round(Math.random()*4)}/>
    </>

  );
};

export default ViewProduct;
