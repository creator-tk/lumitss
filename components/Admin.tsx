"use client"

import { getCurrentUser } from '@/lib/actions/user.action';
import { getServerCookie } from '@/lib/serverAction';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const Admin = () => {

  useEffect(()=>{
    const fetchUserDetails = async ()=>{
      const session = await getServerCookie("appwrite-session");
      if(session){
        const user = await getCurrentUser();
        if(!user.email === "tharunkumarboddeti@gmail.com"){
          redirect("/")
        }
      }else{
        redirect("/signUp")
      }
    }

    fetchUserDetails();
  },[])

  return (
    <div>
      
    </div>
  )
}

export default Admin