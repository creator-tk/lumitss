import Admin from '@/components/Admin';
import { fetchUserDetails } from '@/lib/serverAction'
import { redirect } from 'next/navigation';
import React from 'react'

const page = () =>{
  const currentUser = fetchUserDetails();
  if(!currentUser){
    redirect("/signUp")
  }
  return <Admin/>
}

export default page