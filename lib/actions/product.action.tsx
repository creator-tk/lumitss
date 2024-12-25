"use server"

import { ID, Query } from "node-appwrite";
import { serverAction } from "../appwrite"
import { appWriteConfig } from "../appwrite/config";
import { constructImageUrl, parseStringify } from "../utils";
import { handleError } from "./user.action"
import {InputFile} from "node-appwrite/file"
import { getCurrentUser } from "./user.action";


export const getAllProducts = async () => {
  try {
    const {databases}  = await serverAction();

    const result = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.filesCollectionsId
    );
    return parseStringify(result.documents);

  } catch (error) {
    handleError(error.message, "Failded to fetch")
    console.error('Failed to Fetch Products:', error.message);
    throw error;
  }
};


//Add product in the database
interface addProductProps{
  name: string;
  price: number;
  description: string;
  category: string;
  image: file;
}

export const addProduct = async ({productName, price, productDetails, category, image}:addProductProps) =>{
  const {storage,databases} = await serverAction();
  let uploadedImage;
  try {
    const inputFile =  InputFile.fromBuffer(image, image.name)

    uploadedImage = await storage.createFile(
      appWriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const productDocument = {
      productName,
      price,
      productDetails,
      category,
      image: constructImageUrl(uploadedImage.$id),
      imageId: uploadedImage.$id
    }
    
    const result = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.filesCollectionsId,
      ID.unique(),
      productDocument
    )

    return result;
  } catch (error) {
    if(uploadedImage){
      await storage.deleteFile(
      appWriteConfig.bucketId, uploadedImage.$id
    );
    }
    handleError(error, "Failded to add product")
  }
}
//Added product in the databse


export const addProductToCart = async (id) =>{

  const currentUser = await getCurrentUser();

  if(!currentUser){
    return;
  }

  const {databases} = await serverAction();

  try {
    const userDocument = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id
    );

    const currentUserCart = userDocument.cart ? JSON.parse(userDocument.cart) : [];

    const updatedCart = [...currentUserCart, id];

    const cartString = JSON.stringify(updatedCart);

    await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id,
      {
        cart: cartString
      }
    );

    return "Product added to cart successfully";
  } catch (error) {
    console.log('Failed to add product to cart:', error.message);
  }
}


export const getProducts = async (specific) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const { databases } = await serverAction();

  try {
    if (specific === 'orders') {
      const  orders = currentUser.orders ? JSON.parse(currentUser.orders) : [];

      if(orders.length === 0){
        return [];
      }

      const orderedItems = [];
      const orderDetails = [];
      orders.forEach(eachOrder => {
        orderedItems.push(eachOrder.productId);
        orderDetails.push({
          orderDate: eachOrder.orderDate,
          orderStatus: eachOrder.orderStatus,
          quantity: eachOrder.quantity
        });
      });

      const orderedProducts = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("$id", orderedItems)]
      );
      return {
        orderedItems: orderedProducts.documents,
        orderDetails: orderDetails
      };
    }else if(specific === "cart") {
      const cartData = currentUser.cart ? JSON.parse(currentUser.cart) : [];

      if(cartData.length === 0){
        return [];
      }

      const cartProducts = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("$id", cartData)]
      );
      return cartProducts.documents;
    }
  } catch (error) {
    console.log('Failed to fetch cart products:', error.message);
  }
};


//Remove Product Function started
export const removeProductFromCart = async (id) => {
  const currentUser = await getCurrentUser();

  if(!currentUser){
    return;
  }

  const {databases} = await serverAction();

  try {
    const userDocument = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id
    );

    const currentUserCart = userDocument.cart ? JSON.parse(userDocument.cart) : [];

    const updatedCart = currentUserCart.filter(cartId => cartId !== id);

    const cartString = JSON.stringify(updatedCart);

    await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id,
      {
        cart: cartString
      }
    );

    return "Product removed from cart successfully";
  } catch (error) {
    console.log('Failed to remove product from cart:', error.message);
  }
}


//Place Order functin started
export const placeOrder = async ({location={}, products, quantity={} }) => {

  const currentUser = await getCurrentUser();

  if(!currentUser){
    return;
  }

  console.log(location, products, quantity)

  const {databases} = await serverAction();

  try {
    const userDocument = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id
    );

    let currentUserAddress;
    if(userDocument.address !== ""){
      currentUserAddress = userDocument.address ? JSON.parse(userDocument.address) : {};
    } else {
      currentUserAddress = location;
      await databases.updateDocument(
        appWriteConfig.databaseId,
        appWriteConfig.usersCollectionsId,
        currentUser.$id,
        {
          address: JSON.stringify(currentUserAddress)
        }
      );
    }

    const currentOrders = userDocument.orders ? JSON.parse(userDocument.orders) : [];
    console.log("current Orderes:", currentOrders);

    const newOrders = products.map(eachId => ({
      productId: eachId,
      orderDate: new Date().toISOString(),
      orderStatus: "Confirmed",
      quantity: quantity[eachId] || 1,
    }));

    console.log("new Orders:",newOrders)
    const updatedOrders = [...currentOrders, ...newOrders];

    console.log("Updated Orders", updatedOrders)
    await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id,
      {
        orders: JSON.stringify(updatedOrders)
      }
    );

    return { message: "Order Placed successfully", success: true };
  } catch (error) {
    console.log('Failed to place order:', error.message);
    return { message: "Failed to process!", success: false };
  }
};


