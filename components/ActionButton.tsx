"use client"

import React from 'react'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { addProductToCart, removeProductFromCart } from '@/lib/actions/product.action'
import { getCurrentUser, signOutUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'

export const ActionButton = ({id, action, style}:{id:string; action:string; style:string}) => {
  const {toast} = useToast();
  const  [loading, setLoading] = React.useState(false);


  const performAction = async (action) => {
    try {
      setLoading(true);
      
      const currentUser = await getCurrentUser();

      console.log(currentUser);

      if(!currentUser){
        redirect('/signIn');
      }

      let success;
      if(action === 'cart'){
        success = await addProductToCart(id); 
      }else if(action === "remove"){
        success = await removeProductFromCart(id);
        window.location.reload();
      }else if(action === 'logout'){
        success = await signOutUser();
      }

      if(success){
        toast({
          title: `Product ${action}ed successfully`,
          variant: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error); 
      toast({
        title: "Failed to add product to cart",
        variant: "error",
        duration: 5000,
      }); 
    }finally{
      setLoading(false);
    }
  }
  return (
    <>
      <Button 
        className={`w-[100%] ${style}`} 
        onClick={()=>performAction(action)} 
        disabled={loading}>
        {loading
          ? action === 'cart' ? 'Adding to Cart..' : 'Loading...' 
          : action === 'cart' ? 'Add to Cart' : (action[0].toUpperCase() + action.slice(1))}
      </Button>
    </>
)
}
