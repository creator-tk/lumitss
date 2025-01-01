import { getProducts } from "@/lib/actions/product.action";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import FlipCartAnimation from "@/components/FlipCardAnimation";

export default async function Home() {
  const products = await getProducts("all", "");

  return (
    <main>
      <div className="my-4">
        <div className="relative flex-center w-fill h-[300px] overflow-hidden rounded-lg ml-2 my-6">

          <div className="w-full h-30% ">
            <video muted autoPlay playsInline loop className="h-full w-screen rounded-lg">
              <source src="/Banner.mp4" className="w-full"/>
            </video>
          </div>

          <div className="absolute  flex-center flex-col gap-2">
            <h1 className="lg:text-4xl font-bold text-white text-center sm:text-2xl text-xl">
              Welcome to LUMITSS store. 
            </h1>
            <p className="text-center text-white lg:text-xl text-sm">World wide Trending products now in India</p>
            <Link href="/collections">
              <Button className="lg:text-lg text-sm bg-white text-black">EXPLORE NOW</Button>
            </Link>
          </div>
        </div>
      </div>

      {/**Products */}
      <div className="lg:px-[15%] px-[5%] text-3xl mb-12">
        <h1 className="my-8"><b>Trending Right Now</b></h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0,4).map((eachProduct: Product) => (
            <div
              key={eachProduct.$id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/viewProduct?product=${eachProduct.$id}`}>
                <div className="relative group shadow-gray-400">
                  <Image
                    src={eachProduct.image}
                    alt="Product"
                    width={300}
                    height={300}
                    unoptimized={true}
                    className="w-full lg:h-64 object-cover h-40 group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-sans">View Product</p>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <p className="text-lg font-semibold text-gray-800 hover:text-gray-600 truncate">
                  {eachProduct.productName}
                </p>
                <p className="text-gray-700 mt-2 mb-4">
                  <span className="text-lg">Rs: {eachProduct.price}/-</span> <span className="line-through text-sm">Rs: {eachProduct.price*1.5}</span>
                </p>
                <div className="flex gap-2">
                  <Star/>
                  <Star/>
                  <Star/>
                  <Star/>
                  <Star/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/**Banner Video */}
      <div className="my-12 relative">
        <video muted autoPlay playsInline loop>
          <source src="/demoVideo.mp4"/>
        </video>
      </div>

      {/**Products */}
      <div className="lg:px-[15%] px-[5%] text-3xl mb-12">
        <h1 className="my-8"><b>
          Check Our All Collections
        </b></h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(4,8).map((eachProduct:Product) => (
            <div
              key={eachProduct.$id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/viewProduct?product=${eachProduct.$id}`}>
                <div className="relative group shadow-gray-400">
                  <Image
                    src={eachProduct.image}
                    alt="Product"
                    width={300}
                    height={300}
                    unoptimized={true}
                    className="w-full lg:h-64 object-cover h-40 group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-sans">View Product</p>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <p className="lg:text-lg font-semibold text-gray-800 hover:text-gray-600 truncate text-sm">
                  {eachProduct.productName}
                </p>
                <p className="text-gray-700 mt-2 mb-4">
                  <span className="lg:text-lg text-md">Rs: {eachProduct.price}/-</span> <span className="line-through text-sm">Rs: {eachProduct.price*1.5}</span>
                </p>
                <div className="flex gap-2">
                  <Star/>
                  <Star/>
                  <Star/>
                  <Star/>
                  <Star/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/**Animation */}
      <div className="lg:px-[15%] px-[5%] flex-center flex-col">
        <h1 className="text-center text-5xl my-8"><b>Limited Time!</b></h1>
        <FlipCartAnimation text={["SALE ON ", new Date().toLocaleDateString()]}
        interval={3000} />
        <p className="text-center">Our limited time 50% off sale is ending in few days..</p>
      </div>
    </main>
  );
}