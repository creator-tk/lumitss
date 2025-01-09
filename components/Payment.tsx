"use client";

import  { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { verifyPayment } from "@/lib/actions/payment.action";
import { useToast } from "@/hooks/use-toast";

// Declare Razorpay on the window object
declare global {
  interface Window {
    Razorpay: {
      new (options: object): { open: () => void };
    };
  }
}

interface PaymentProps {
  address: string;
  orderDetails: {
    location: string;
    products: string[];
    quantity: Record<string, number>;
    price: number;
    orderId: string;
  };
  close: () => void; 
}

const Payment = ({ orderDetails, address, close }: PaymentProps) => {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript()
      .then(() => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: orderDetails.price * 100,
          currency: "INR",
          name: "LUMITSS",
          description: "Seamless Shopping Experience at LUMITSS – Your Trusted Online Store for Quality Products",
          image: "/lumitss.png",
          order_id: orderDetails.orderId,
          handler: async function (response) {
    
            const responseObject = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };
        
            const verificationResult = await verifyPayment(responseObject, orderDetails, address);
            if (verificationResult.success) {
              toast({
                title: "Payment Successful",
              });
              window.location.replace("/user/orders");
            } else {
              alert("Payment verification failded.")
            }  
            close();
          },
          modal: {
            ondismiss: function () {
              console.log("Payment popup closed by user.");
              close(); 
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open(); 
    
        return () => {
          // Cleanup code if needed
        };
      })
      .catch((error) => {
        console.error("Razorpay script failed to load", error);
        alert("Something went wrong while loading the payment gateway. Please try again later.");
      });

    
    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [orderDetails, address, close, router, toast]);

  return null; 
};

export default Payment;
