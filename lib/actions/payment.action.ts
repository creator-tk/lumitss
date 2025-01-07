"use server"

import Razorpay from "razorpay";
import { razorpayConfig } from "../appwrite/config";
import crypto from "crypto"
import { placeOrder } from "./product.action";

export const initializePayment = async (amount:number, currency:string) => {
  try {   
    console.log("RazorpayKeyId:", razorpayConfig.keyId, "Key Secret:", razorpayConfig.keySecret)
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

    console.log("Razorpay Order created:", order);

    return order;

  } catch (error) {
    console.error("Error initializing payment:", error);
    throw new Error("Failed to initialize payment.");
  }
};


export const verifyPayment = async (responseObject:paymentResponseProps, orderDetails:PlaceOrderProps, address:string) => {
  try {
    // console.log("OrderDetails from verifyPayment",orderDetails);
    // console.log("RazorpayObject", responseObject);
    // console.log("Address from payment verification", address)

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = responseObject;
    const {location, products, quantity, price} = orderDetails;


    const sha = crypto.createHmac("sha256", razorpayConfig.keySecret);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return {
        success: false,
        message: "Payment verification failed. Signature mismatch.",
      };
    }

    let updatedAddress = location;
    if (Object.keys(location).length === 0) {
      updatedAddress = address;
    }

    const response = await placeOrder({location:updatedAddress, products, quantity, price})

    if(response?.success){
      console.log(response.message);
    }else{
      console.log("Something went wrong plz check the code once again")
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
