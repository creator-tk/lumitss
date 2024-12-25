import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='remove-scrollbar'>
      <Header/>
      {children}
      <Footer/>
      <Toaster/>
    </main>
  )
}

export default layout