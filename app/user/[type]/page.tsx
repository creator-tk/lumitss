import React from 'react'
import Cart from '@/components/Cart';
import Profile from '@/components/Profile';
import Orders from '@/components/Orders';

const page = async ({params}:{params: Promise<{ type: string }>}) => {
  const type = ((await params)?.type as string) || ""

  let content;
  switch (type) {
    case 'cart':
      content = <Cart/>
      break;
    case 'profile':
      content = <Profile/>
      break;
    case 'orders':
      content = <Orders/>
      break;
  }
  return (
    <div>
      {content}
    </div>
  )
}

export default page