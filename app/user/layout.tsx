import React from 'react'
import { getCurrentUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';

const layout = async ({children}:{children: React.ReactNode}) => {
  
  const currentUser = await getCurrentUser();

  if(!currentUser){
    redirect("/signIn")
    return
  }

  return (
    <div className='w-screen h-screen lg:px-[20%] lg:py-10 px-[5%] py-2'>
    <section className='mb-4 sticky top-0 flex lg:justify-between justify-center'>
      <Link href="/">
        <Image src='/lumitss.png' width={150} height={100} alt="Logo" className='w-[100px]'/>
        {/* <div>
          <p className="from-accent-foreground lg:text-5xl text-4xl text-center ">LUMITSS</p>
        </div> */}
      </Link>

      <Link href='/'>
        <p className='text-center p-2 rounded-full cursor-pointer hidden lg:block'>Continue Shopping</p>
      </Link>
    </section>

    <section className='h-[88%] overflow-y-auto'>
      {children}  
    </section>
    <Toaster/>
    </div>
  )
}

export default layout