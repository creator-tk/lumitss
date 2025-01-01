"use client"

import { fetchAllUsers, fetchOrders } from '@/lib/serverAction';
import React, { useEffect, useState } from 'react'
import Loading from './Loader';
import { Loader2 } from 'lucide-react';


const Admin_Orders =  () => {
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [ordersLoading, setOrdersLoading]=useState(false);

  const onChangeHandler = (e)=>{
    const date = e.target.value;
    setDate(date);
    setOrdersLoading(true);
    const filteredOrders = async () =>{
      const orders = await fetchOrders(date);
      setOrders(orders)
    }
    filteredOrders();
    setOrdersLoading(false);
  }
  console.log(users)
    
  useEffect(()=>{
    setPageLoading(true);
    const fetchData = async ()=>{
      const result = await fetchAllUsers();
      setUsers(result);
    }
    fetchData();
    setPageLoading(false);
  },[date])

  return (
    <div>
      <input type="date" onChange={onChangeHandler} />
      {pageLoading ? (
        <Loading/>
      ):(!ordersLoading ? (
          orders.length > 0 ? (
            orders.map(eachOrder => (
              <ul key={eachOrder.$id}>
                <li>{eachOrder.productName}</li>
              </ul>
            ))
          ):(<div>No Orders Yet</div>)
        ):<Loader2/>
      )}
    </div>
  )
}

export default Admin_Orders