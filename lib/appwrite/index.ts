'use server'

import { Client, Account, Databases, Storage, Avatars } from "node-appwrite";
import { appWriteConfig } from "./config";
import { cookies } from "next/headers";
import { razorpay } from 'razorpay';

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appWriteConfig.endpointUrl)
    .setProject(appWriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) return null;

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const serverAction = async () => {
  const client = new Client()
    .setEndpoint(appWriteConfig.endpointUrl)
    .setProject(appWriteConfig.projectId)
    .setKey(appWriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};


export const initializePayment = async (amount, currency = 'INR') => {
  try {
    const client = new Client();
    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT_URL) 
      .setProject(process.env.APPWRITE_PROJECT_ID)   
      .setKey(process.env.APPWRITE_SECRET_KEY);    

    const payment = new razorpay({
      key_id: process.env.NEXT_RAZORPAY_KEY_ID,   
      key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET, 
    });

    const amountInPaise = amount * 100; 

    const orderOptions = {
      amount: amountInPaise,  
      currency: currency || 'INR',  
      receipt: `receipt#${Date.now()}`,  
    };

    const order = await payment.orders.create(orderOptions);

    console.log("Razorpay Order created:", order);

    return {
      order_id: order.id,
      amount: order.amount / 100,
      currency: order.currency,
    };

  } catch (error) {
    console.error("Error initializing payment:", error);
    throw new Error("Failed to initialize payment.");
  }
};