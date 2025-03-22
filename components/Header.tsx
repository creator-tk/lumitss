"use client";

import Image from "next/image";
import React, { useState, useEffect, KeyboardEvent } from "react";
import { Input } from "./ui/input";
import { LoaderPinwheel, Package, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getServerCookie } from "@/lib/serverAction";
import { useRouter } from "next/navigation";
import Cart from "./Cart";

type User = {
  fullName: string;
  role: "user" | "admin";
};

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [category, setCategory] = useState("")
  const [showCart, setShowCart] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const session = await getServerCookie("appwrite-session");
        if (session) {
          const userStatus = await getCurrentUser();
          setUser(userStatus as User);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const selectCategory = (category) =>{
    setCategory(category)
    router.push(`/collections?category=${category}`)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <header className="lg:grid grid-cols-12 mb-6 lg:px-[15%] px-[2%] justify-center items-center gap-4">
        <Link href="/" className="col-span-3" onClick={()=>setCategory("")}>
        <div className="lg:w-auto w-[100%] flex justify-center items-center sm:relative">
          <Image
              src="/lumitss.png"
              alt="logo"
              width={120}
              height={100}
              className="w-[120px] lg:w-[150px]"
            />
        </div> 
        </Link>

        <div className="search_container w-[100%] !bg-transparent lg:flex items-center col-span-6 hidden ">
          <Input
            placeholder="Search"
            type="text"
            className="search_input lg:w-auto w-[100%] font-sans hidden lg:block"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="w-[5vw] cursor-pointer hidden lg:block"
            onClick={handleSearch}
          />
        </div>

        <div className="lg:flex gap-4 items-center hidden col-span-3">
          {user ? (
            <div className="flex-center gap-4">
              <Link href="/user/orders">
                <div className="items-center gap-1 hidden lg:flex">
                  <Package xlinkTitle="Orders" />
                  Orders
                </div>
              </Link>

              <div className="lg:flex items-center gap-1 cursor-pointer" onClick={()=>setShowCart(true)}>
                <ShoppingCart />
                Cart
              </div>

              <Link href="/user/profile">
                <div className="lg:flex-center p-1 rounded-xl cursor-pointer gap-1">
                  <div className="w-10 h-10 bordered !rounded-full flex-center cursor-pointer">
                    {user?.fullName ? user.fullName[0].toUpperCase() : ""}
                  </div>
                  <p className="flex truncate max-w-14">{user?.fullName}</p>
                </div>
              </Link>
            </div>
          ) : !loading ? (
            <Link
              href="/signUp"
              className="rounded-xl bg-black text-white p-3 text-sm self-end px-4 "
            >
              <p className="text-center ">SignUp</p>
            </Link>
          ) : (
            <div className="flex">
              <LoaderPinwheel className="animate-spin"/>
              <p>...</p>
            </div>

          )}

          {user?.role === "admin" && (
            <Link href="/admin">
              <p>Admin</p>
            </Link>
          )}
        </div>
      </header>

      {/**category */}
      <div className="px-[18%] lg:flex justify-between hidden">
        <p className={`cursor-pointer ${category === "gift" && "underline"}`} onClick={()=>selectCategory("gift")}>Gift</p>

        <p className={`cursor-pointer ${category === "kitchen" && "underline"}`} onClick={()=>selectCategory("kitchen")}>Home & kitchen</p>

        <p className={`cursor-pointer ${category === "desktop" && "underline"}`} onClick={()=>selectCategory("desktop")}>Desktop Decor</p>

        <p className={`cursor-pointer ${category === "unique" && "underline"}`} onClick={()=>selectCategory("unique")}>Unique Items</p>
      </div>

      <div className="search_container w-[100%] !bg-transparent lg:hidden items-center col-span-6 flex px-6 gap-2 bodered !rounded">
          <Input
            placeholder="Search"
            type="text"
            className="search_input lg:w-auto w-[100%] font-sans block lg:hidden"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Search
            className="w-[5vw] cursor-pointer block lg:hidden"
            onClick={handleSearch}
          />
        </div>
      
      {showCart && (
        <div className="fixed right-0 top-0 bottom-0 bg-white w-[360px] bordered z-10 p-4 overflow-y-scroll scroll-b">
          <div className="justify-end flex scrollbar-hide">
            <X onClick={()=>setShowCart(false)} className="cursor-pointer"/>
          </div>
          <Cart/>
        </div>
      )}
    </>

  );
};

export default Header;
