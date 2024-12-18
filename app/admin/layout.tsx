import Image from 'next/image'
import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div>
      <header className='flex justify-between shadow-xl p-4 px-24 items-center'>
        <Image
          src="/logo (2).png"
          alt='logo'
          width={125}
          height={20}
        />

        <div className='flex gap-4 '>
          <p className="font-bold">Users</p>
          <p className="font-bold">Products</p>
          <p className="font-bold">Accounts</p>
          <p className="font-bold">Orders</p>
          <p className="font-bold"></p>
        </div>
      </header>
      {children}
    </div>
  )
}

export default layout