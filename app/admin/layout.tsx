// import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { fetchUserDetails } from '@/lib/serverAction';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  await fetchUserDetails();

  return (
    <div>
      <header className='flex sm:justify-between shadow-xl p-4 px-24 items-center justify-center'>
        <Link href="/">
          {/* <Image
            src="/logo (2).png"
            alt='logo'
            width={125}
            height={20}
          /> */}
          <div>
            <p className="from-accent-foreground lg:text-5xl text-4xl text-center ">LUMITSS</p>
          </div>
        </Link>

        <div className=' gap-4 cursor-pointer fixed bottom-0 flex sm:relative sm:bg-transparent sm:w-auto bg-gray-100 p-4 justify-between w-[100%]'>
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
      <Toaster/>
    </div>
  );
}

export default Layout;
