"use client";

import React, { useState, useEffect } from "react";
import { House, Package, Shield, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getServerCookie } from "@/lib/serverAction";

type User = {
  fullName: string;
  role: "user" | "admin";
};

const Footer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const session = await getServerCookie("appwrite-session");
        if (session) {
          const userStatus = await getCurrentUser();
          setUser(userStatus as User); // Ensure the returned value matches the User type
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <footer className="fixed bottom-0 w-full bg-gray-100 p-4 lg:hidden bg-opacity-80 bg-blur mt-8 backdrop-blur-sm">
      <div className="flex justify-between w-[100%]">
        {user ? (
          <div className="flex items-center justify-between gap-4 w-[100%]">
            <Link href="/" title="Home">
              <House />
            </Link>

            <Link href="/user/orders" title="Orders">
              <Package xlinkTitle="Orders" />
            </Link>

            <Link href="/user/cart" title="Cart">
              <ShoppingCart />
            </Link>

            <Link href="/user/profile" title="Profile">
              <div className="w-10 h-10 bordered !rounded-full flex-center cursor-pointer">
                {user?.fullName ? user.fullName[0].toUpperCase() : ""}
              </div>
            </Link>

            {user?.role === "admin" && (
              <Link href="/admin" title="Admin">
                <Shield />
              </Link>
            )}
          </div>
        ) : !loading ? (
          <Link
            href="/signUp"
            className="rounded-2xl bg-black text-white p-3 text-sm w-[100%] lg:w-auto"
          >
            SignUp
          </Link>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
