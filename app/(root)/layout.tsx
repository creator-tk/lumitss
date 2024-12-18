import Header from '@/components/Header'
import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main>
      <Header/>
      {children}
    </main>
  )
}

export default layout