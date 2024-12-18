"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getServerCookie } from "@/lib/serverAction";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getServerCookie("appwrite-session")
      console.log("session",session)
      if (session) {
        const userStatus = await getCurrentUser();
        setUser(userStatus);
      }
    };

    fetchUser();
  }, []);

  console.log(user)
  return (
    <header className="flex w-screen justify-between gap-6 px-8 lg:px-20 py-4 bg-gray-100 items-center">
      <Image
        src="/logo.png"
        alt="logo"
        width={120}
        height={100}
        className="w-[80px] lg:w-[120px]"
      />

      <div className="search_container">
        <Input placeholder="Search" type="text" className="search_input" />
        <Button className="rounded-full bg-transparent">
          <Search />
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <div className="flex-center gap-4">
            <Link href="/user/cart">
              <ShoppingCart className="text-black cursor-pointer w-6 hidden lg:block" />
            </Link>

            <div className="flex-center bordered p-1 rounded-xl cursor-pointer">
              <div className="w-10 h-10 bordered !rounded-full flex-center cursor-pointer">
                {user?.fullName ? user.fullName[0].toUpperCase() : ""}
              </div>
              <p className="hidden lg:flex">{user?.fullName}</p>
            </div>
          </div>
        ) : (
          <Link href="/signUp" className="rounded-2xl bg-black text-white p-3 text-sm">
            SignUp
          </Link>
        )}

        {user?.email === "tharunkumarboddeti@gmail.com"?(
          <Link href="/admin">
            <p>Admin</p>
          </Link>
        ):""}
      </div>
    </header>
  );
};

export default Header;
