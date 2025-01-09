"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getAllUsers, getCurrentUser } from "./actions/user.action";
import { getAllProducts } from "./actions/product.action";


export const getServerCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
};

export const deleteServerCookie = async (name: string) => {
  const response = NextResponse.next();
  response.cookies.delete(name);  // This deletes the cookie by name
  return response;
};


export const fetchUserDetails = async ()=>{
  const session = await getServerCookie("appwrite-session");
  if(session){
    const user = await getCurrentUser();
    if(!user){
      redirect("/signUp")
    }
    if(user?.role !== "admin"){
      redirect("/")
    }
  }else{
    redirect("/signUp")
  }
}

export const fetchAllUsers = async () => {
  try {
    const result = await getAllUsers();
    const parsedOrders = result.flatMap((user) => {
      if(user.orders.trim() !== ""){
        const userOrders = JSON.parse(user.orders).map(order => ({
          ...order,
          userId: user.$id,
          userName: user.fullName,
          address: user.address
        }));
        return userOrders;
      }else{
        return []
      }

    });
    return { users: result, orders: parsedOrders };
  } catch (error) {
    console.error("Error occurred while fetching all users:", error.message);
    return { users: [], orders: [] };
  }
};


export const fetchOrders = async (date = "") => {
  const { orders } = await fetchAllUsers(); 

  if (!orders || orders.length === 0) {
    return [];
  }

  const formattedDate = date ? new Date(date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

  const filteredOrders = orders.filter((order) => {
    const orderDate = order.orderDate.split("T")[0];
    return !formattedDate || orderDate === formattedDate;
  });

  if (filteredOrders.length === 0) {
    return [];
  }

  const allProducts = await getAllProducts();

  const enrichedOrders = filteredOrders.map((order) => {
    const productDetails = allProducts.find(
      (product) => product.$id === order.productId
    );

    return {
      ...order,
      productName: productDetails?.productName || "Unknown Product",
      quantity: order.quantity,
    };
  });

  return enrichedOrders;
};
