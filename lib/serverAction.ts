"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

const orders = [];

export const fetchAllUsers = async ()=>{
  try {
    const result = await getAllUsers();
    result.map(eachUser => {
      const parsedOrders = JSON.parse(eachUser.orders);
      orders.push(...parsedOrders);
    })

    return result;
  } catch (error) {
    console.log("Error occured while fetching all  users:",error.message)
  }
}

export const fetchOrders = async (date) => {

  if (!orders || orders.length === 0) {
    return "No Orders Yet!";
  }

  const filteredOrders = orders.filter(order => {
    const parsedDate = order.orderDate.split("T")[0];
    return date === "" || parsedDate === date; 
  });


  if (filteredOrders.length === 0) {
    return "No matching orders for the selected date.";
  }

  const allProducts = await getAllProducts();
  let resultedOrders;
  filteredOrders.map(eachOrder => {
    resultedOrders = allProducts.filter(eachProduct => {
      return eachProduct.$id === eachOrder.productId
    })
  })


  return resultedOrders
};
