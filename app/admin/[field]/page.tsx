import React from 'react'
import Users from '@/components/Users'
import Admin_Products from '@/components/Admin_Products';
import Admin_Accounts from '@/components/Admin_Accounts';
import Admin_Orders from '@/components/Admin_Orders';
import Admin from '@/components/Admin';

const Page = async ({ params }: SearchParamsProps) => {
  const field =  (await params)?.field as string || "admin"; 

  let content;

  switch (field) {
    case "users":
      content = <Users />;
      break;
    case "products":
      content = <Admin_Products />;
      break;
    case "accounts":
      content = <Admin_Accounts />;
      break;
    case "orders":
      content = <Admin_Orders />;
      break;
    default:
      content = <Admin />;
  }

  return (
    <div className='px-24 py-4'>
      <h1 className='font-sans text-2xl'>{field.toUpperCase()}</h1>

      <div className='px-4'>
        {content}
      </div>
    </div>
  );
}

export default Page;
