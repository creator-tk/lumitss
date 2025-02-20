import React from 'react'
import Cart from '@/components/Cart';
import Profile from '@/components/Profile';
import Orders from '@/components/Orders';
import Processing from '@/components/Processing';

const page = async ({params}:UserPageProps) => {
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
    case "Processing":
      content = <Processing/>
      break;
  }
  return (
    <div>
      {content}
    </div>
  )
}

export default page