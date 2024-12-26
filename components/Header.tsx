"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Package, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getServerCookie } from "@/lib/serverAction";
import { useRouter } from "next/navigation";

interface User {
  fullName: string;
  role: string;
  [key: string]: unknown;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const session = await getServerCookie("appwrite-session");
      if (session) {
        const userStatus = await getCurrentUser();
        setUser(userStatus);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <header className="flex w-screen justify-between gap-6 px-8 lg:px-20 py-4 bg-gray-100 items-center sticky top-0 z-10">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={120}
          height={100}
          className="w-[80px] lg:w-[120px]"
        />
      </Link>

      <div className="search_container w-[100%] flex items-center">
        <Input
          placeholder="Search"
          type="text"
          className="search_input lg:w-auto w-[100%]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); 
              handleSearch();
            }
          }}
        />
        <Search
          className="w-[5vw] cursor-pointer hidden lg:block"
          onClick={handleSearch}
        />
      </div>

      <div className="lg:flex gap-4 items-center hidden">
        {user ? (
          <div className="flex-center gap-4">
            <Link href="/user/orders">
              <div className="items-center gap-1 hidden lg:flex">
                <Package xlinkTitle="Orders" />
                Orders
              </div>
            </Link>
            <Link href="/user/cart">
              <div className="lg:flex items-center gap-1">
                <ShoppingCart />
                Cart
              </div>
            </Link>
            <Link href="/user/profile">
              <div className="lg:flex-center p-1 rounded-xl cursor-pointer gap-1 ">
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
            className="rounded-xl bg-black text-white p-3 text-sm  self-end px-4"
          >
            SignUp
          </Link>
        ) : (
          <p>Loading...</p>
        )}

        {user?.role === "admin" ? (
          <Link href="/admin">
            <p>Admin</p>
          </Link>
        ) : (
          ""
        )}
      </div>
    </header>
  );
};

export default Header;
