"use client"

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Processing = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const [countDown, setCountDown] = useState(3);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        router.push("/user/orders");
      }, 3000);

      const interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 1) {
            clearInterval(interval); 
            return 0; 
          }
          return prev - 1; 
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }else if(status === "failure"){
      alert("Sorry we unable to verify your payment! If money was debited don't worry get in touch with our custmor support. We always with you.")
      router.push("/")
    }
  }, [status, router]);

  return (
    <div className="bg-gray-300 p-6 rounded-lg h-[100%]">
      {status === "success" ? (
        <div>
          <p className="text-2xl text-green-600">
            Congratulations! Your order is successfully placed. Redirecting to
            your orders...
          </p>
          <p className="text-5xl text-center">{countDown}</p>
        </div>
      ) : (
        <p className="text-2xl">Please wait, we are processing your order...</p>
      )}
    </div>
  );
};

export default Processing;
