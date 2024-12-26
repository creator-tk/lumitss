// user.actions.ts

'use server'

import { createSessionClient, serverAction } from "../appwrite";
import { appWriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { Query, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { User, ActionResult, OTPResponse, UserResponse, Session, ServerError } from "@/types"; 


export const handleError = async (error: unknown, message: string): Promise<void> => {
  console.error(error, message);
  throw error;
};

// Get a user by their email
const getUserByEmail = async (email: string): Promise<UserResponse | null | string> => {
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

// Send email OTP for account verification
export const sendEmailOTP = async ({ email }: { email: string }): Promise<string | undefined> => {
  const { account } = await serverAction();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send Email OTP");
    return undefined;
  }
};

// Create a new account
export const createAccount = async ({ fullName, email }: { fullName: string; email: string }): Promise<string> => {
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

// Verify OTP and create session
export const verifyOTP = async ({ accountId, password }: { accountId: string; password: string }): Promise<string> => {
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
    throw error; // Ensure error is thrown in case of failure
  }
};

// Get the current logged-in user
export const getCurrentUser = async (): Promise<UserResponse | null> => {
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

// Sign in user
export const signInUser = async ({ email }: { email: string }): Promise<OTPResponse | null> => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
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

// Get all users from the database
export const getAllUsers = async (): Promise<UserResponse[] | void> => {
  try {
    const { databases } = await serverAction();

    const result = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.usersCollectionsId,
    );

    return result.documents;
  } catch (error) {
    console.log("Error: " + error.message);
    return undefined;
  }
};

// Sign out user by deleting the current session
export const signOutUser = async (): Promise<void> => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
    redirect("/"); // Redirect to homepage after sign out
  } catch (error) {
    handleError(error, "Failed to sign out user");
  }
};
