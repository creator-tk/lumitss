import React from "react";
import { fetchAllUsers } from "@/lib/serverAction";


const Users: React.FC = async () => {
  const {users} = await fetchAllUsers();

  return ( 
    <div>
      <div className="grid grid-cols-11 gap-3 p-2 bordered my-2 sticky top-0">
        <p className="col-span-2 text-[1.3vw]">Name</p>
        <p className="col-span-3 text-[1.3vw]">Email</p>
        <p className="col-span-6 text-[1.3vw]">Address</p>
      </div>
      {users.length > 0 ? (
        users.map((eachUser) => (
          <React.Fragment key={eachUser.$id}>
            <ul className="grid grid-cols-11 gap-4">
              <li className="col-span-2 text-[1vw]">{eachUser.fullName}</li>
              <li className="col-span-3  text-[1vw] truncate" title={eachUser.email}>
                {eachUser.email}
              </li>
              <li title={eachUser.address} className="col-span-6 text-[1vw] truncate text-wrap">{eachUser.address || "Na"}</li>
            </ul>
            <hr />
          </React.Fragment>
        ))
      ) : (
        <p className="text-center text-gray-300">No users Signed Yet!</p>
      )}
    </div>
  );
};

export default Users;
