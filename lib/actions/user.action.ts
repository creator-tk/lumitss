"use server"

import { createSessionClient, serverAction } from "../appwrite";
import { appWriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { Query, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const handleError = async (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const getUserByEmail = async (email: string) => {
  try {
    const { databases } = await serverAction();

    if (!email || email.trim() === "" || typeof email !== "string") {
      throw new Error("Please provide a valid email.");
    }

    const result = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
  } catch (error) {
    return `Something went wrong: ${error}`;
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await serverAction();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send Email OTP");
  }
};

export const createAccount = async ({ fullName, email }: { fullName: string; email: string }) => {

  if (!fullName || typeof fullName !== "string") {
    throw new Error("Invalid User name");
  }

  if (!email || typeof email !== "string") {
    throw new Error("Invalid Email, please provide a valid email");
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) throw new Error("User Already exists");

  const accountId = await sendEmailOTP({ email });

  if (!accountId) {
    throw new Error("Verification Failed");
  }

  const adminAccess = await serverAction();

  await adminAccess.databases.createDocument(
    appWriteConfig.databaseId,
    appWriteConfig.usersCollectionsId,
    ID.unique(),
    {
      fullName,
      email,
      accountId,
    }
  );
  return parseStringify({ accountId });
};

export const verifyOTP = async ({ accountId, password }: { accountId: string; password: string }) => {
  try {
    const { account } = await serverAction();

    const session = await account.createSession(accountId.toString(), password.toString());

    const expires = new Date(); 
    expires.setFullYear(expires.getFullYear() + 1);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: expires
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to Verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    if (!result?.$id) {
      throw new Error("Invalid account Id");
    }

    const user = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      [Query.equal("accountId", [result.$id])]
    );

    if (!user || user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (typeof existingUser !== 'string' && existingUser?.accountId) {
      const accountId = existingUser.accountId;

      await sendEmailOTP({ email });
      return parseStringify({ accountId });
    } else {
      throw new Error("User not found with the provided email");
    }
  } catch (error) {
    console.log("User not found:", error);
    throw error;
  }
};


export const getAllUsers = async () => {
  try {
    const { databases } = await serverAction();

    const result = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId
    );

    return result.documents;
  } catch (error) {
    console.log("Error:" + error.message);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
    redirect("/");
    return "LogedOut Successfully"
  } catch (error) {
    handleError(error, "Failed to sign out user");
  }
};

export const updateOrderStatus = async (userId: string, productId: string, newStatus: string) => {
  const { databases } = await serverAction();

  try {
    const userDocument = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      userId
    );

    const orders = JSON.parse(userDocument.orders);

    const updatedOrders = orders.map((order) => {
      if (order.productId === productId) {
        return {
          ...order,
          orderStatus: newStatus, 
        };
      }
      return order;
    });

    await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
      userId,
      {
        orders: JSON.stringify(updatedOrders),
      }
    );

    console.log(`Order status updated successfully for user ${userId}`);
  } catch (error) {
    console.error("Error updating order status:", error.message);
  }
};
