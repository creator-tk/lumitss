"use server"

import { ID, Query } from "node-appwrite";
import { serverAction } from "../appwrite";
import { appWriteConfig } from "../appwrite/config";
import { constructImageUrl, parseStringify } from "../utils";
import { handleError } from "./user.action";
import { InputFile } from "node-appwrite/file";
import { getCurrentUser } from "./user.action";
// import razorpay from "razorpay";

// Fetch all products
export const getAllProducts = async () => {
  try {
    const { databases } = await serverAction();

    const result = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.filesCollectionsId
    );
    return parseStringify(result.documents);
  } catch (error) {
    handleError(error.message, "Unable to fetch products.");
    console.error("Error fetching products:", error.message);
    throw error;
  }
};

// Add product to the database
export const addProduct = async ({
  productName,
  price,
  productDetails,
  category,
  image,
}: AddProductProps) => {
  const { storage, databases } = await serverAction();
  let uploadedImage;
  try {
    if (image instanceof File) {
      const inputFile = InputFile.fromBuffer(image as unknown as Buffer, image.name);

      uploadedImage = await storage.createFile(
        appWriteConfig.bucketId,
        ID.unique(),
        inputFile
      );
    } else {
      throw new Error("Image is not a valid File");
    }

    const productDocument = {
      productName,
      price,
      productDetails,
      category,
      image: constructImageUrl(uploadedImage.$id),
      imageId: uploadedImage.$id,
    };

    const result = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.filesCollectionsId,
      ID.unique(),
      productDocument
    );

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (uploadedImage) {
        await storage.deleteFile(appWriteConfig.bucketId, uploadedImage.$id);
      }
      handleError(error.message, "Unable to add product.");
      throw error;
    }
  }
};


// Add product to cart
export const addProductToCart = async (id: string) => {
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

    const currentUserCart = userDocument.cart ? JSON.parse(userDocument.cart) : [];

    const updatedCart = [...currentUserCart, id];

    const cartString = JSON.stringify(updatedCart);

    await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id,
      {
        cart: cartString,
      }
    );

    return "Product successfully added to cart.";
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error adding product to cart:", error.message);
      throw error;
    }
  }
};

// Fetch products based on criteria
export const getProducts = async (
  specific?: string,
  searchQuery?: string
) => {
  const { databases } = await serverAction();

  try {
    if (specific === "all") {
      const result = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId
      );
      return JSON.parse(JSON.stringify(result.documents));
    } else if (specific === "orders") {
      const currentUser = await getCurrentUser();
    
      if (!currentUser) {
        return;
      }
    
      const orders: Order[] = currentUser.orders ? JSON.parse(currentUser.orders) : [];
    
      if (orders.length === 0) {
        return [];
      }
    
      const orderedProductsDetails = await Promise.all(
        orders.map(async (eachOrder) => {
          const productDetails = await databases.getDocument(
            appWriteConfig.databaseId,
            appWriteConfig.filesCollectionsId,
            eachOrder.productId
          );
    
          return {
            productDetails,
            orderDate: eachOrder.orderDate,
            orderStatus: eachOrder.orderStatus,
            quantity: eachOrder.quantity,
          };
        })
      );
    
      return orderedProductsDetails;   
    } else if (specific === "cart") {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        return;
      }

      const cartData: string[] = currentUser.cart ? JSON.parse(currentUser.cart) : [];

      if (cartData.length === 0) {
        return [];
      }

      const cartProducts = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("$id", cartData)]
      );
      return cartProducts.documents;
    } else if (specific === "search") {
      if (!searchQuery || searchQuery.trim() === "") {
        return [];
      }

      const searchResults = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.search("productName", searchQuery)]
      );

      if (searchResults.documents.length === 0) {
        return {
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
        searchResults: searchResults.documents || [],
        relatedProducts: relatedProducts.documents || [],
      };
    } else if (specific === "viewProduct") {
      if (searchQuery === "" || !searchQuery) {
        return {};
      }

      const resultedProduct = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("$id", searchQuery)]
      );

      return resultedProduct.documents[0];
    } else if (specific === "collections"){
      if(searchQuery === "" || !searchQuery){
        return [];
      }

      const result = await databases.listDocuments(
        appWriteConfig.databaseId,
        appWriteConfig.filesCollectionsId,
        [Query.equal("category", searchQuery)]
      )

      return result;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error fetching products:", error.message);
      throw error;
    }
  }
};

// Remove product from cart
export const removeProductFromCart = async (id: string) => {
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

    const currentUserCart: string[] = userDocument.cart ? JSON.parse(userDocument.cart) : [];

    const updatedCart = currentUserCart.filter((cartId) => cartId !== id);

    const cartString = JSON.stringify(updatedCart);

    await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id,
      {
        cart: cartString,
      }
    );

    return "Product successfully removed from cart.";
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error removing product from cart:", error.message);
      throw error;
    }
  }
};

// Place order
export const placeOrder = async ({
  location = {},
  products,
  quantity = {},
  price,
}: PlaceOrderProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { message: "User not logged in.", success: false };
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
      currentUserAddress = userDocument.address
        ? JSON.parse(userDocument.address)
        : {};
    } else {
      currentUserAddress = location;
      await databases.updateDocument(
        appWriteConfig.databaseId,
        appWriteConfig.usersCollectionsId,
        currentUser.$id,
        {
          address: JSON.stringify(currentUserAddress),
        }
      );
    }

    let currentOrders: Order[] = userDocument.orders
      ? JSON.parse(userDocument.orders)
      : [];

    const currentDate = new Date();

    currentOrders = currentOrders.filter((eachOrder) => {
      const orderDate = new Date(eachOrder.orderDate);
      const timeDifference = currentDate.getTime() - orderDate.getTime();
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      return daysDifference <= 15; 
    });

    const newOrders = products.map((eachId: string) => ({
      productId: eachId,
      orderDate: new Date().toISOString(),
      orderStatus: "Confirmed",
      quantity: quantity[eachId] || 1,
      price: price * (quantity[eachId] || 1),
    }));

    const updatedOrders = [...currentOrders, ...newOrders];

    await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      currentUser.$id,
      {
        orders: JSON.stringify(updatedOrders),
      }
    );

    const formData = new FormData();
    formData.append("access_key", process.env.WEB3FORM_ACCESS_KEY || "");
    formData.append("name", currentUser.fullName);
    formData.append("message", "Order Placed by the customer");

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    return { message: "Order placed successfully.", success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error placing order:", error.message);
      return { message: "Order placement failed.", success: false };
    }
  }
};


//updating the product details
export const updateProductDetails = async (
  productId: string,
  {
    productName,
    price,
    productDetails,
    category,
    image,
  }: {
    productName?: string;
    price?: number;
    productDetails?: string;
    category?: string;
    image?: File | null;
  }
) => {

  const { storage, databases } = await serverAction();
  let uploadedImage;

  try {
  
    if (image instanceof File) {
      uploadedImage = await storage.updateFile(
        appWriteConfig.bucketId,
        productId, 
        image
      );
    }

    
    const productDocument = {
      productName,
      price,
      productDetails,
      category,
      image: uploadedImage ? constructImageUrl(uploadedImage.$id) : undefined,
      imageId: uploadedImage?.$id || undefined,
    };

  
    const result = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.filesCollectionsId,
      productId,  
      productDocument 
    );

    return result;
  } catch (error: unknown) {
    handleError(error?.message || "Unknown error occurred", "Unable to update product.");
    throw error;
  }
};



