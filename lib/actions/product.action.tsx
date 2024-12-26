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
interface AddProductProps {
  productName: string;
  price: number;
  productDetails: string;
  category: string;
  image: File; // Accepts a File object
}

//
export const addProduct = async ({
  productName,
  price,
  productDetails,
  category,
  image
}: AddProductProps) => {
  const { storage, databases } = await serverAction();
  let uploadedImage;

  try {
    // Convert the File to an InputFile object for Appwrite's storage
    const inputFile = InputFile.fromBuffer(image, image.name);

    // Upload the image to Appwrite Storage
    uploadedImage = await storage.createFile(
      appWriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    // Construct the image URL using the uploaded image's ID
    const imageUrl = constructImageUrl(uploadedImage.$id);

 
    const productDocument = {
      productName,
      price,
      productDetails,
      category,
      image: imageUrl, // Image URL as a string
      imageId: uploadedImage.$id, // Store the image ID for reference
    };

    // Insert the new product into the database
    const result = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.filesCollectionsId,
      ID.unique(),
      productDocument
    );

    return {
      success: true,
      data: result,
      message: "Product Added Successfully"
    };

  } catch (error) {
    if (uploadedImage) {
      await storage.deleteFile(appWriteConfig.bucketId, uploadedImage.$id);
    }

    handleError(error, "Failed to add product");
    return {
      success: false,
      message: "Failed to add product"
    };
  }
};

//Added product in the databse


export const addProductToCart = async (id: string): Promise<ActionResult> =>{

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

    return {
      success:true,
      message:"Product Add to the cart Successfully"
    };
  } catch (error) {
    console.log( error.message);
    return{
      success:false,
      message:"Failded to add product to the cart"
    }
  }
}


// interface Product {
//   $id: string;
//   image: string;
//   productName: string;
//   price: string;
// }

interface ProductsResponse {
  success: boolean;
  data: Product[] | null;
  message?: string;
  searchResults?: Product[];
  relatedProducts?: Product[];
  orderedItems?: Product[];
  orderDetails?: { orderDate: string; orderStatus: string; quantity: number }[];
}

export const getProducts = async (specific: string, searchQuery: string = ''): Promise<ProductsResponse> => {
  const { databases } = await serverAction();

  try {
    if (specific === 'all') {
      const result = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId
      );
      return {
        success: true,
        data: JSON.parse(JSON.stringify(result.documents)) || [],
      };
    } else if (specific === 'orders') {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          message: "User not found",
          data: [], // Ensure a consistent return type (data is an array)
        };
      }

      const orders = currentUser.orders ? JSON.parse(currentUser.orders) : [];

      if (orders.length === 0) {
        return {
          success: true,
          orderedItems: [],
          orderDetails: [],
        };
      }

      const orderedItems = [];
      const orderDetails = [];
      orders.forEach((eachOrder) => {
        orderedItems.push(eachOrder.productId);
        orderDetails.push({
          orderDate: eachOrder.orderDate,
          orderStatus: eachOrder.orderStatus,
          quantity: eachOrder.quantity,
        });
      });

      const orderedProducts = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("$id", orderedItems)]
      );

      return {
        success: true,
        orderedItems: orderedProducts.documents || [],
        orderDetails: orderDetails,
      };
    } else if (specific === 'cart') {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          message: "User not found",
          data: [],
        };
      }

      const cartData = currentUser.cart ? JSON.parse(currentUser.cart) : [];

      if (cartData.length === 0) {
        return {
          success: true,
          message:"No products found",
          data: [], 
        };
      }

      const cartProducts = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("$id", cartData)]
      );
      return {
        success: true,
        data: cartProducts.documents || [],
        message:"data fetched Successfully"
      };
    } else if (specific === 'search') {
      if (!searchQuery || searchQuery.trim() === '') {
        return {
          success: false,
          message: "Search query is empty",
          searchResults: [],
          relatedProducts: [],
        };
      }

      const searchResults = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.search("productName", searchQuery)]
      );

      if (searchResults.documents.length === 0) {
        return {
          success: false,
          message: "No products found",
          searchResults: [],
          relatedProducts: [],
        };
      }

      const relatedProducts = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [
          Query.equal(
            "category",
            searchResults.documents[0].category
          ),
        ]
      );

      return {
        success: true,
        searchResults: searchResults.documents || [],
        relatedProducts: relatedProducts.documents || [],
      };
    } else if (specific === "viewProduct") {
      if (!searchQuery) {
        return {
          success: false,
          message: "Product ID is required",
          data: null, // Return null for missing data
        };
      }

      const resultedProduct = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("$id", searchQuery)]
      );

      return {
        success: true,
        data: resultedProduct.documents[0] || null, // Ensure valid data or null
      };
    }
  } catch (error) {
    console.log('Failed to fetch products:', error.message);
    return {
      success: false,
      message: "Failed to fetch products",
      data: [], // Ensure consistent empty data
    };
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

    return{ 
      success:true,
      message:"Product removed from cart successfully"};
  } catch (error) {
    console.log('Failed to remove product from cart:', error.message);
    return{
      success:false,
      message:"Failded to remove"
    }
  }
}


//Place Order functin started
// interface PlaceOrderArgs {
//   location: Address; 
//   products: string[]; 
//   quantity: Record<string, number>; 
// }

// interface PlaceOrderResult {
//   message: string;
//   success: boolean;
// }

interface Address {
  country: string;
  phone: string;
  area: string;
  pincode: string;
  street: string;
  landmark: string;
}

// interface User {
//   $id: string;
//   address: string;
//   orders: string;
// }

export const placeOrder = async ({ location, products, quantity = {} }: { location: Address, products: string[], quantity?: Record<string, number> }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  const { databases } = await serverAction();

  try {
    const userDocument = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id
    );

    let currentUserAddress;
    if (userDocument.address !== "") {
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

    const newOrders = products.map(eachId => ({
      productId: eachId,
      orderDate: new Date().toISOString(),
      orderStatus: "Confirmed",
      quantity: quantity[eachId] || 1,
    }));

    const updatedOrders = [...currentOrders, ...newOrders];

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




