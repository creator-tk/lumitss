import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='remove-scrollbar my-4'>
      <Header/>
      {children}
      <div className='py-[2%] px-[15%] bg-black text-white mt-8 lg:mb-0 mb-20'>
        <div className='flex lg:flex-row justify-between !W-1/2 flex-col'>
          <h1 className='lg:text-4xl text-2xl'>LUMITSS</h1>
          <div className='text-gray-400 my-4'>
            <p>Search</p>
            <p>Terms & conditions</p>
            <p>Privacy Policy</p>
            <p>Shipping & Delivery</p>
            <p>Return Policy</p>
          </div>
        </div>
        <hr className='w-full border-gray-500 my-2' />
        <p>© 2025 LUMITSS</p>
      </div>
      <Footer/>
      <Toaster/>
    </main>
  )
}

export default layout