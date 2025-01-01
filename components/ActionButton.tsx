"use client";

import React from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { addProductToCart, removeProductFromCart } from "@/lib/actions/product.action";
import { getCurrentUser, signOutUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ActionButtonProps {
  id?: string | undefined;
  action?: "cart" | "remove" | "logout" | "update";
  style?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ id, action, style }) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState<boolean>(false);

  const performAction = async (action: "cart" | "remove" | "logout" | "update") => {
    try {
      setLoading(true);

      const currentUser = await getCurrentUser();

      if (!currentUser) {
        redirect("/signIn");
        return;
      }

      let success: string | undefined;
      if (id) {
        if (action === "cart") {
          success = await addProductToCart(id);
        } else if (action === "remove") {
          success = await removeProductFromCart(id);
          if (success) {
            window.location.reload();
          }
        } else if (action === "logout") {
          success = await signOutUser();
        } else if (action === "update") {
          return toast({ title: "Update Functionality is not implemented yet" });
        }

        if (success) {
          toast({
            title: `Action completed successfully`,
            description: `Product ${action === "cart" ? "added to cart" : action === "remove" ? "removed from cart" : "logout completed"} successfully`,
            duration: 3000,
          });
        } else {
          throw new Error("Action failed");
        }
      } else {
        throw new Error("ID is required for this action");
      }
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={`w-full ${style}`}
      onClick={() => {
        if (action) {
          performAction(action);
        } else {
          toast({ title: "Action is required" });
        }
      }}
      disabled={loading}
    >
      {loading
        ? action === "cart"
          ? (<><Loader2 className="animate-spin" /> Adding to Cart...</>)
          : action === "remove"
            ? (<><Loader2 className="animate-spin" /> Removing from Cart...</>)
            : action === "update"
              ? "Updating" : "Logging out..."
        : action === "cart"
          ? "Add to Cart"
          : action === "remove"
            ? "Remove from Cart"
            : action === "update"
              ? "Update" : "Logout"}
    </Button>
  );
};
