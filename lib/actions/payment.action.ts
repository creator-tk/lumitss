"use server"

import Razorpay from "razorpay";
import { razorpayConfig } from "../appwrite/config";
import crypto from "crypto"
import { placeOrder } from "./product.action";

export const initializePayment = async (amount:number, currency:string) => {
  try {   
    const razorpay = new Razorpay({
      key_id : razorpayConfig.keyId,
      key_secret: razorpayConfig.keySecret
    })

    const amountInPaise = amount * 100; 

    const orderOptions = {
      amount: amountInPaise,  
      currency: currency || 'INR',  
      receipt: `receipt#${Date.now()}`,  
    };

    const order = await razorpay.orders.create(orderOptions);

    return order;

  } catch (error) {
    console.error("Error initializing payment:", error);
    throw new Error("Failed to initialize payment.");
  }
};

export const verifyPayment = async (responseObject: paymentResponseProps, orderDetails: PlaceOrderProps, address: string) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = responseObject;
    const { location, products, quantity, price } = orderDetails;

    // Verify signature using HMAC
    const sha = crypto.createHmac("sha256", razorpayConfig.keySecret);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return {
        success: false,
        message: "Payment verification failed. Signature mismatch.",
      };
    }

    // Handle address fallback if location is invalid
    let updatedAddress = location;
    if (!location || Object.keys(location).length === 0) {  // Check for null or empty object
      updatedAddress = address;
    }

    // Proceed with placing the order
    const response = await placeOrder({ location: updatedAddress, products, quantity, price });

    if (response?.success) {
      console.log(response.message);
    } else {
      console.log("Something went wrong, please check the code.");
    }

    return {
      success: true,
      message: "Payment was successful.",
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      success: false,
      message: "An error occurred during payment verification.",
    };
  }
};

