import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex w-screen'>
      <section className='lg:w-1/2 h-screen lg:flex-center hidden lg:flex bg-black !shadow-xl !shadow-white'>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={555}
            height={100}
          />
        </Link>

      </section>
      <section className='bg-white text-black flex-center lg:w-1/2 w-screen h-screen bordered'>
        {children}
      </section>
      
    </div>
  )
}

export default layout