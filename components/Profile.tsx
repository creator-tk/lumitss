import { ActionButton } from '@/components/ActionButton';
import { getCurrentUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react';

const Profile = async () => {
  const currentUser = await getCurrentUser();
  const parsedAddress = {};

  if(currentUser.address){
    parsedAddress = JSON.parse(JSON.parse(currentUser?.address));
  }

  console.log("UserId", currentUser.$id);

  if (!currentUser) {
    redirect('/signIn');
    return null; 
  }

  return (
    <div className="">
      <h1 className="text-[2vw]">PROFILE:</h1>
      <div className="px-8">
        <hr className="my-4" />
        <h2>Name: {currentUser.fullName}</h2>
        <hr className="my-4" />
        <h2>Email: {currentUser.email}</h2>
        <hr className="my-4" />
        <h2>Phone: {parsedAddress?.phone || 'Not provided'}</h2>
        <hr className="my-4" />
      </div>

      <div>
        <p>Address:</p>
        <div className='px-6'>
          <p>{currentUser?.fullName}, <br /> {parsedAddress?.street}, <br /> {parsedAddress?.pincode}, <br /> {parsedAddress?.landmark}, <br /> {parsedAddress?.country}</p>
        </div>


      </div>
      <div className="flex justify-end">
        <ActionButton
          id={currentUser.$id}
          action="logout"
          style="!w-auto bg-white bordered text-black hover:text-white mr-1"
        />
        <ActionButton action="update" id={currentUser.$id} style="!w-auto"/>
      </div>
    </div>
  );
};

export default Profile;
