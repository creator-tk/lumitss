"use client";

import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '@/lib/serverAction';

interface User {
  $id: string;
  fullName: string;
  email: string;
  address?: string;
  cart?: string;
  orders?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const result = await fetchAllUsers();
      setUsers(result);
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div>
      <div className='grid grid-cols-11 gap-3 p-2 bordered my-2 sticky top-0'>
        <p className='col-span-1'>Name</p>
        <p className='col-span-1'>Email</p>
        <p className='col-span-3'>Address</p>
        <p className='col-span-3'>Cart</p>
        <p className='col-span-3'>Orders</p>
      </div>
      {users.length > 0 
        ? users.map((eachUser) => (
          <React.Fragment key={eachUser?.$id}>
            <ul className='grid grid-cols-11 gap-2'>
              <li className='col-span-1'>{eachUser?.fullName}</li>
              <li className='col-span-1 truncate' title={eachUser?.email}>{eachUser?.email}</li>
              <li className='col-span-3'>{eachUser?.address ? eachUser.address : "Na"}</li>
              <li className='col-span-3'>{eachUser?.cart ? eachUser.cart : "Na"}</li>
              <li className='col-span-3'>{eachUser?.orders ? eachUser.orders : "Na"}</li>
            </ul>
            <hr />
          </React.Fragment>
        ))
        : !loading 
        ? (<p className='text-center text-gray-300'>No users Signed Yet !</p>) 
        : (<p className='text-center text-green-500'>Loading...</p>)
      }
    </div>
  );
};

export default Users;
