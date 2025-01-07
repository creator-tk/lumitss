"use client"

interface PaymentProps {
  address: string;
  orderDetails: {
    location: string;
    products: string[];
    quantity: Record<string, number>;
    price: number;
    orderId: string;
  };
  close: ()=>void;
}

import React, { useEffect } from 'react';
import { verifyPayment } from '@/lib/actions/payment.action';
import { useToast } from '@/hooks/use-toast';

const Payment = ({ orderDetails, address, close }: PaymentProps) => {

  const {toast} = useToast();

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
          key: `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}`,
          amount: orderDetails.price * 100,
          currency: 'INR',
          name: 'LUMITSS',
          description: "Seamless Shopping Experience at LUMITSS – Your Trusted Online Store for Quality Products",
          image: '/lumitss.png',
          order_id: orderDetails.orderId,
          handler: async function(response) {
            close();
            const responseObject = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }

            const verificationResult = await verifyPayment(responseObject, orderDetails, address)
            if(verificationResult.success){
              toast({
                title: "Payment Successfully"
              });
              window.location.replace("/user/orders");
              close();
            }else{
              alert("Verification Failded")
              close();
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      })
      .catch((error) => {
        console.error('Razorpay script failed to load', error);
        alert('Something went wrong while loading the payment gateway. Please try again later.');
      });

    return () => {
      // Cleanup script if needed
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetails, address]);

  return <div>Payment</div>;
};

export default Payment;
