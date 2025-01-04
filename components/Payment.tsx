"use client"

interface PaymentProps {
  address: string;
  orderDetails: {
    location: string;
    products: string[];
    quantity: Record<string, number>;
    price: number;
  };
}

import { appWriteConfig } from '@/lib/appwrite/config';
import React, { useEffect } from 'react';

const Payment = ({ orderDetails, address }: PaymentProps) => {
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
          description: 'Test Payment',
          image: 'https://your-logo-url.com',
          handler: function(response) {
            const paymentId = response.razorpay_payment_id;
            console.log("Payment successful. Payment ID: " + paymentId);

            fetch(`${appWriteConfig.endpointUrl}/functions/${appWriteConfig.functionId}/executions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Appwrite-Project': appWriteConfig.projectId,
              },
              body: JSON.stringify({
                paymentId,
                orderDetails,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  alert('Payment Verified! Your order is confirmed.');
                } else {
                  alert('Payment verification failed.');
                }
              })
              .catch((error) => {
                console.log('Error verifying payment:', error, "ErrorMessage:", error.message);
                alert('An error occurred while verifying payment.');
              });
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
  }, [orderDetails, address]);

  return <div>Payment</div>;
};

export default Payment;
