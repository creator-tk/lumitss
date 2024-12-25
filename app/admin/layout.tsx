import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { fetchUserDetails } from '@/lib/serverAction'

const layout = async ({children}:{children: React.ReactNode}) => {

  await fetchUserDetails()

  return (
    <div>
      <header className='flex justify-between shadow-xl p-4 px-24 items-center'>
        <Link href="/">
          <Image
            src="/logo (2).png"
            alt='logo'
            width={125}
            height={20}
          />
        </Link>

        <div className='flex gap-4 cursor-pointer'>
          <Link href="/admin/users">
            <p className="font-bold">Users</p>
          </Link>

          <Link href="/admin/products">
            <p className="font-bold">Products</p>
          </Link>

          <Link href="/admin/accounts">
            <p className="font-bold">Accounts</p>
          </Link>

          <Link href="/admin/orders">
            <p className="font-bold">Orders</p>
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}

export default layout