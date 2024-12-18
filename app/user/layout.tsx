import React from 'react'
// import { getCurrentUser } from '@/lib/actions/user.action'
// import { redirect } from 'next/navigation';

const layout = async ({children}:{children: React.ReactNode}) => {
  // const currentUser = await getCurrentUser();

  // if(!currentUser){
  //   redirect("/signUp")
  //   return
  // }

  return (
    <div className='flex-center w-screen h-screen'>
      <div className='pri-container'>
        {children} 
      </div>

    </div>
  )
}

export default layout