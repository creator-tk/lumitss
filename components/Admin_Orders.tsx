"use client";

import React, { useEffect, useState } from "react";
import { fetchAllUsers, fetchOrders } from "@/lib/serverAction";
import Loading from "./Loader";
import { updateOrderStatus } from "@/lib/actions/user.action";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";

interface OrderType {
  userId: string;
  userName:string;
  productId: string;
  productName: string;
  orderDate: string;
  orderStatus: string;
  quantity: number;
  address: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [date, setDate] = useState<string>("");
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const { toast } = useToast();

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageLoading(true);
    const selectedDate = e.target.value;
    setDate(selectedDate);
    const filteredOrders = await fetchOrders(selectedDate);
    setOrders(filteredOrders || []);
    setPageLoading(false);
  };

  const handleStatusChange = async (userId: string, productId: string, currentStatus: string) => {
    try {
      setStatusLoading(true);

      const newStatus = currentStatus === "confirmed" ? "Couriered" : "confirmed";  
      await updateOrderStatus(userId, productId, newStatus);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.productId === productId && order.userId === userId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      toast({
        title: "Status Updated",
        description: `Order status updated to ${newStatus}`,
      });
      setStatusLoading(false);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error.message,
      });
      console.error(error.message);
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      await fetchAllUsers();

      if (!date) {
        const todayOrders = await fetchOrders();
        setOrders(todayOrders || []);
      }

      setPageLoading(false);
    };

    fetchData();
  }, [date]);

  return (
    <div className="p-4">
      <input
        type="date"
        className="mb-4 p-2 border rounded"
        onChange={onChangeHandler}
      />
      <ul className="grid grid-cols-10">
        <li className="col-span-1 font-bold text-xl">UserName</li>
        <li className="col-span-3 font-bold text-xl">Address</li>
        <li className="col-span-1 font-bold text-xl">Order Date</li>
        <li className="col-span-3 font-bold text-xl">Product Details</li>
        <li className="col-span-1 font-bold text-xl">Quantity</li>
        <li className="col-span-1 font-bold text-xl">Order Status</li>
      </ul>

      {pageLoading ? (
        <Loading />
      ) : orders.length > 0 ? (
        orders.map((eachOrder, index) => {
          return (
            <ul key={index} className="grid grid-cols-10 gap-4 my-4">
              <li className="col-span-1">{eachOrder?.userName || "Unknown User"}</li>
              <li className="col-span-3 truncate">
                {eachOrder?.address || "No Address Available"}
              </li>
              <li className="col-span-1">{eachOrder?.orderDate.split("T")[0]}</li>
              <li className="col-span-3">{eachOrder?.productName}</li>
              <li className="col-span-1">{eachOrder?.quantity}</li>
              <li className="col-span-1 font-bold">
                <span className="text-green-600">
                  {eachOrder?.orderStatus === "Couriered" ? (
                    <span>
                      {eachOrder?.orderStatus} <CheckCircle2 className="inline-block" />
                    </span>
                  ) : (
                    <span className="text-orange-800">{eachOrder?.orderStatus}</span>
                  )}
                </span>
                <div className="flex gap-2">
                  {!statusLoading ? (
                    <select
                      className={`px-4 py-2 rounded-lg text-xl font-semibold `}
                      value={eachOrder?.orderStatus}
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      onChange={(e) => handleStatusChange(eachOrder.userId, eachOrder.productId, eachOrder.orderStatus)}
                    >
                      <option value="">Select Status</option>
                      <option value="confirmed" className="text-orange-600">
                        Order Confirmed
                      </option>
                      <option value="Couriered" className="text-green-600">
                        Order Couriered
                      </option>
                    </select>
                  ) : (
                    <Loader2 className="animate-spin" />
                  )}
                </div>
              </li>
            </ul>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-full text-3xl text-gray-700">
          No Orders!
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
