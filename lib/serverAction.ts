"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllUsers, getCurrentUser } from "./actions/user.action";

/**
 * Sets a cookie on the server.
 * @param name - Name of the cookie.
 * @param value - Value of the cookie.
 * @param options - Additional options for the cookie (e.g., path, maxAge).
 */
export const setServerCookie = async (
  name: string,
  value: string,
  options?: { path?: string; maxAge?: number; secure?: boolean; httpOnly?: boolean }
) => {
  await cookies().set(name, value, {
    path: options?.path || "/",
    maxAge: options?.maxAge,
    secure: options?.secure ?? true,
    httpOnly: options?.httpOnly ?? true,
  });
};

/**
 * Gets a cookie value on the server.
 * @param name - Name of the cookie to retrieve.
 * @returns The cookie value or `undefined` if not found.
 */
export const getServerCookie = async (name: string): string | undefined => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
};

/**
 * Deletes a cookie on the server.
 * @param name - Name of the cookie to delete.
 */
export const deleteServerCookie = async (name: string) => {
  await cookies().delete(name);
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

export const fetchAllUsers = async ()=>{
  const result = await getAllUsers();
  return result;
}
