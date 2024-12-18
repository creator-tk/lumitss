import React from 'react'
import Image from 'next/image'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex w-screen'>
      <section className='lg:w-1/2 h-screen lg:flex-center hidden lg:flex'>
        <Image
          src="/logo.png"
          alt="Logo"
          width={555}
          height={100}
        />
      </section>
      <section className='bg-black text-white flex-center lg:w-1/2 w-screen h-screen'>
        {children}
      </section>
      
    </div>
  )
}

export default layout