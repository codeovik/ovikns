import React, { useEffect } from 'react';
import { useAppContext } from "@/context/AppContext";
import { FaBoxOpen } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ManageOrders() {
  const { fetchAllOrders, adminOrders, updateOrderStatus } = useAppContext();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      <div className="overflow-x-auto bg-box border border-box-secondary rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(adminOrders) && adminOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-mono text-sm">{order._id?.slice(-6).toUpperCase()}</td>
                <td className="p-4">
                  <p className="font-medium">{order.user?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="p-4 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 font-medium">${order.totalAmount?.toFixed(2) || "0.00"}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.paymentStatus}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{order.paymentMethod}</p>
                </td>
                <td className="p-4">
                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) => updateOrderStatus(order._id, value)}
                  >
                    <SelectTrigger className="w-35">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!adminOrders || !Array.isArray(adminOrders) || adminOrders.length === 0) && (
          <div className="p-12 text-center text-gray-500">
            <FaBoxOpen className="mx-auto text-4xl mb-4 opacity-50" />
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}