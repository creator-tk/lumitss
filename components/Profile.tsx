import { ActionButton } from '@/components/ActionButton';
import { getCurrentUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react';

const Page: React.FC = async () => {

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/login');
  }

  return (
    <div className='mx-52 bordered h-[95%] !rounded-2xl shadow-2xl p-4'>
      <h1 className='text-[2vw]'>PROFILE:</h1>
      <div className='px-8'>
        <hr className='my-4'/>
        <h2>Name: {currentUser.fullName}</h2>
        <hr className='my-4'/>
        <h2>Email: {currentUser.email}</h2>
        <hr className='my-4'/>
        <h2>Phone: {currentUser.phone}</h2>
        <hr className='my-4'/>
        <h2>Address: {currentUser.address}</h2>
        <hr className='my-4'/>
      </div>
      <div className='flex justify-end'>
        <ActionButton action="logout" style='!w-auto bg-white bordered text-black hover:text-white mr-1' />
        <ActionButton action="update" id={currentUser.$id} style='!w-auto' />
      </div>
    </div>
  );
};

export default Page;
